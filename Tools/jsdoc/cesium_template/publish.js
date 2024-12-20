/* global env: true */
/* eslint-disable import/no-unresolved */

const fs = require('jsdoc/fs');
const helper = require('jsdoc/util/templateHelper');
const path = require('jsdoc/path');
const taffy = require('taffydb').taffy;
const template = require('jsdoc/template');
// const logger = require('jsdoc/util/logger');
// const util = require('util');
const { urlObjects } = require('./config.js');

const htmlSafe = helper.htmlsafe;
const linkto = helper.linkto;
const resolveAuthorLinks = helper.resolveAuthorLinks;
const hasOwnProp = Object.prototype.hasOwnProperty;

let data;
let view;
let apiScopeTitle;
let authorLink;

// eslint-disable-next-line no-undef
let outdir = env.opts.destination;

function find(spec) {
  return helper.find(data, spec);
}

function tutorialLink(tutorial) {
  return helper.toTutorial(tutorial, null, {
    tag: 'em',
    classname: 'disabled',
    prefix: 'Tutorial: ',
  });
}

function getAncestorLinks(doclet) {
  return helper.getAncestorLinks(data, doclet);
}

/**
 *
 * @param {*} doclet
 * @param {string} hash
 * @returns {string}
 */
function hashToLink(doclet, hash) {
  // add turf links
  if (/^turf#/.test(hash)) {
    return `<a href="${hash.replace('turf#', `${urlObjects.turf}/api/`)}">${hash}</a>`;
  }

  // 以 # 号开头的字符串
  if (!/^(#.+)/.test(hash)) {
    return hash;
  }

  let url = helper.createLink(doclet);

  url = url.replace(/(#.+|$)/, hash);
  return `<a href="${url}">${hash}</a>`;
}

function needsSignature(doclet) {
  let needsSig = false;

  // function and class definitions always get a signature
  if (doclet.kind === 'function' || doclet.kind === 'class' || doclet.kind === 'module') {
    needsSig = true;
  }

  // typedefs that contain functions get a signature, too
  else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names && doclet.type.names.length) {
    for (let i = 0, l = doclet.type.names.length; i < l; i++) {
      if (doclet.type.names[i].toLowerCase() === 'function') {
        needsSig = true;
        break;
      }
    }
  }

  return needsSig;
}

function addSignatureParams(f) {
  const params = helper.getSignatureParams(f, 'optional');
  f.signature = `${f.signature || ''}(${params.join(', ')})`;
}

function addSignatureReturns(f) {
  const returnTypes = helper.getSignatureReturns(f);

  f.signature = `<span class="signature">${f.signature || ''}</span>`;

  if (returnTypes.length) {
    f.signature += ` &rarr; <span class="type-signature returnType">${returnTypes.length ? returnTypes.join('|') : ''}</span>`;
  }
}

function addSignatureTypes(f) {
  const types = helper.getSignatureTypes(f);

  f.signature = `${f.signature || ''}<span class="type-signature">${types.length ? ` : ${types.join('|')}` : ''}</span>`;
}

function addAttribs(f) {
  const attribs = helper.getAttribs(f);

  if (f.deprecated) {
    attribs.push('deprecated');
  }

  if (attribs.length) {
    f.attribs = attribs
      .map(function (attrib) {
        return `<span class="type-signature attribute-${attrib}">${htmlSafe(attrib)}</span> `;
      })
      .join('');
  }
}

function shortenPaths(files, commonPrefix) {
  Object.keys(files).forEach(function (file) {
    files[file].shortened = files[file].resolved
      .replace(commonPrefix, '')
      // always use forward slashes
      .replace(/\\/g, '/');
  });

  return files;
}

function getPathFromDoclet(doclet) {
  if (!doclet.meta) {
    return null;
  }

  return doclet.meta.path && doclet.meta.path !== 'null' ? path.join(doclet.meta.path, doclet.meta.filename) : doclet.meta.filename;
}

function generate(title, docs, filename, resolveLinks) {
  resolveLinks = resolveLinks !== false;

  const docData = {
    filename: filename,
    title: title,
    docs: docs,
    apiScopeTitle, // add custom title
    authorLink,
  };

  const outpath = path.join(outdir, filename);
  let html = view.render('container.tmpl', docData);

  if (resolveLinks) {
    html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
  }

  fs.writeFileSync(outpath, html, 'utf8');
}

/**
 * Look for classes or functions with the same name as modules (which indicates that the module
 * exports only that class or function), then attach the classes or functions to the `module`
 * property of the appropriate module doclets. The name of each class or function is also updated
 * for display purposes. This function mutates the original arrays.
 *
 * @private
 * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
 * check.
 * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
 */
function attachModuleSymbols(doclets, modules) {
  const symbols = {};

  // build a lookup table
  doclets.forEach(function (symbol) {
    symbols[symbol.longname] = symbol;
  });

  // eslint-disable-next-line array-callback-return
  return modules.map(module => {
    if (symbols[module.longname]) {
      module.module = symbols[module.longname];
      module.module.name = `${module.module.name.replace('module:', 'require("')}")`;
    }
  });
}

/**
 * Create the navigation sidebar.
 * @param {object} members The members that will be used to create the sidebar.
 * @param {array<object>} members.classes
 * @param {array<object>} members.externals
 * @param {array<object>} members.globals
 * @param {array<object>} members.mixins
 * @param {array<object>} members.modules
 * @param {array<object>} members.namespaces
 * @param {array<object>} members.tutorials
 * @param {array<object>} members.events
 * @return {string} The HTML for the navigation sidebar.
 */
function buildNav(members) {
  let nav = '<div id="ClassList">';
  const seen = {};
  const hasClassList = false;
  const classNav = '';
  const globalNav = '';

  const result = members.modules
    .concat(members.classes)
    .concat(members.globals)
    .concat(members.namespaces)
    .sort(function (a, b) {
      return a.longname.toLowerCase().localeCompare(b.longname.toLowerCase());
    });

  const addItems = items => {
    if (items.length) {
      items.forEach(function (m) {
        if (!hasOwnProp.call(seen, m.longname)) {
          nav += `<li data-name="${m.name}">${linkto(m.longname, m.name)}</li>`;
        }
        seen[m.longname] = true;
      });
    }
  };

  if (process.env.CESIUM_PACKAGES) {
    process.env.CESIUM_PACKAGES.split(',').forEach(pkg => {
      nav += `<h5>${pkg}</h5>`;
      nav += '<ul>';
      addItems(result.filter(item => item.meta.package === pkg));
      nav += '</ul>';
    });
  } else {
    nav += '<ul>';
    addItems(result);
    nav += '</ul>';
  }

  nav += '</div>';

  return nav;
}

/**
 * @param {TAFFY} taffyData See <http://taffydb.com/>.
 * @param {object} opts
 * @param {Tutorial} tutorials
 */
exports.publish = function (taffyData, opts, tutorials) {
  data = taffyData;

  // eslint-disable-next-line no-undef
  const conf = env.conf.templates || {};
  conf.default = conf.default || {};

  const apiScope = !!opts.apiScope ? opts.apiScope + '.' : ''; // add custom project scope
  apiScopeTitle = !!opts.apiScopeTitle ? opts.apiScopeTitle : opts.apiScope;
  authorLink = opts.authorLink;

  const templatePath = opts.template;
  view = new template.Template(`${templatePath}/tmpl`); // load tmpl as render function

  // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
  // doesn't try to hand them out later
  const indexUrl = helper.getUniqueFilename('index');
  // don't call registerLink() on this one! 'index' is also a valid long name

  const globalUrl = helper.getUniqueFilename('global');
  helper.registerLink('global', globalUrl);

  // set up templating
  view.layout = 'layout.tmpl';

  // set up tutorials for helper
  helper.setTutorials(tutorials);

  data = helper.prune(data);
  data.sort('longname, version, since');
  helper.addEventListeners(data);

  let sourceFiles = {};
  const sourceFilePaths = [];

  // The item of the data add name
  data().each(function (doclet) {
    doclet.attribs = '';
    doclet.apiScope = apiScope;

    doclet.longname = doclet.longname.replace(/^module:/, '');
    if (doclet.memberof) doclet.memberof = doclet.memberof.replace(/^module:/, '');

    if (doclet.examples) {
      doclet.examples = doclet.examples.map(function (example) {
        let caption;
        let code;

        if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
          caption = RegExp.$1;
          code = RegExp.$3;
        }

        return {
          caption: caption || '',
          code: code || example,
        };
      });
    }

    // create @see for jsdoc
    if (doclet.see) {
      doclet.see.forEach(function (seeItem, i) {
        doclet.see[i] = hashToLink(doclet, seeItem);
      });
    }

    // build a list of source files
    let sourcePath;
    if (doclet.meta) {
      sourcePath = getPathFromDoclet(doclet);
      sourceFiles[sourcePath] = {
        resolved: sourcePath,
        shortened: null,
      };
      if (sourceFilePaths.indexOf(sourcePath) === -1) {
        sourceFilePaths.push(sourcePath);
      }
    }
  });

  // update outdir if necessary, then create outdir
  const packageInfo = (find({ kind: 'package' }) || [])[0];
  if (packageInfo && packageInfo.name) {
    outdir = path.join(outdir, packageInfo.name, packageInfo.version);
  }
  fs.mkPath(outdir);

  // copy the template's static files to outdir
  const fromDir = path.join(templatePath, 'static');
  const staticFiles = fs.ls(fromDir, 3);

  staticFiles.forEach(function (fileName) {
    const toDir = fs.toDir(fileName.replace(fromDir, outdir));
    fs.mkPath(toDir);
    fs.copyFileSync(fileName, toDir);
  });

  if (sourceFilePaths.length) {
    sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
  }
  data().each(function (doclet) {
    const url = helper.createLink(doclet);
    helper.registerLink(doclet.longname, url);

    // replace the filename with a shortened version of the full path
    let docletPath;
    if (doclet.meta) {
      docletPath = getPathFromDoclet(doclet);
      docletPath = sourceFiles[docletPath].shortened;
      if (docletPath) {
        doclet.meta.filename = docletPath;
        doclet.meta.sourceUrl = conf.sourceUrl.replace('{version}', process.env.CESIUM_VERSION).replace('{filename}', docletPath);
        if (process.env.CESIUM_PACKAGES) {
          doclet.meta.package = process.env.CESIUM_PACKAGES.split(',').find(
            // (package) => doclet.meta.sourceUrl.indexOf(package) > -1 // sourceUrl is error
            pkg => doclet.meta.path.indexOf(pkg.replace('packages/', '')) > -1
          );
        }
      }
    }
  });

  data().each(function (doclet) {
    const url = helper.longnameToUrl[doclet.longname];

    if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
    } else {
      doclet.id = doclet.name;
    }

    if (needsSignature(doclet)) {
      addSignatureParams(doclet);
      addSignatureReturns(doclet);
      addAttribs(doclet);
    }
  });

  // do this after the urls have all been generated
  data().each(function (doclet) {
    doclet.ancestors = getAncestorLinks(doclet);

    if (doclet.kind === 'member') {
      addSignatureTypes(doclet);
      addAttribs(doclet);
    }

    if (doclet.kind === 'constant') {
      addSignatureTypes(doclet);
      addAttribs(doclet);
      doclet.kind = 'member';
    }
  });

  const members = helper.getMembers(data);

  // add template helpers
  view.find = find;
  view.linkto = linkto;
  view.resolveAuthorLinks = resolveAuthorLinks;
  view.tutorialLink = tutorialLink;
  view.htmlsafe = htmlSafe;

  // once for all
  view.nav = buildNav(members);
  attachModuleSymbols(find({ kind: ['class', 'function'], longname: { left: 'module:' } }), members.modules);

  if (members.globals.length) {
    generate('Global', [{ kind: 'globalobj' }], globalUrl);
  }

  // index page displays information from package.json and lists files
  const files = find({ kind: 'file' });
  const packages = find({ kind: 'package' });

  const origLayout = view.layout;
  view.layout = 'indexLayout.tmpl';
  generate(
    'Index',
    packages
      .concat([
        {
          kind: 'mainpage',
          readme: opts.readme,
          longname: opts.mainpagetitle ? opts.mainpagetitle : 'Main Page',
        },
      ])
      .concat(files),
    indexUrl
  );
  view.layout = origLayout;

  // set up the lists that we'll use to generate pages
  const classes = taffy(members.classes);
  const modules = taffy(members.modules);
  const namespaces = taffy(members.namespaces);
  const globals = taffy(members.globals);

  const typesJson = {};

  Object.keys(helper.longnameToUrl).forEach(function (longname) {
    let items = helper.find(classes, { longname: longname });

    if (!items.length) {
      items = helper.find(modules, { longname: longname });
    }

    if (!items.length) {
      items = helper.find(namespaces, { longname: longname });
    }

    if (!items.length) {
      items = helper.find(globals, { longname: longname });
    }

    if (items.length) {
      const title = items[0].name;
      const filename = helper.longnameToUrl[longname];
      generate(title, items, filename);

      const titleLower = title.toLowerCase();

      typesJson[titleLower] = typesJson[titleLower] || [];
      typesJson[titleLower].push(filename);

      const members = find({ kind: ['function', 'member'], memberof: longname });
      members.forEach(function (member) {
        member = member.id;
        let memberLower = member.toLowerCase();
        const firstChar = memberLower.charAt(0);
        if (firstChar === '.' || firstChar === '~') {
          memberLower = memberLower.substring(1);
        }

        typesJson[memberLower] = typesJson[memberLower] || [];
        typesJson[memberLower].push(`${filename}#${member}`);
      });
    }
  });

  fs.writeFileSync(`${outdir}/types.txt`, JSON.stringify(typesJson), 'utf8');
};
