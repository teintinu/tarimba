/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	  'use strict';
	  var DEBUG_MODE, COMMAND_ID = 'me.drewh.jsbeautify', OLD_COMMAND_ID = 'beautify', COMMAND_SAVE_ID = COMMAND_ID + '.autosave', COMMAND_TIMESTAMP = COMMAND_ID + '-timeStamp', CONTEXTUAL_COMMAND_ID = COMMAND_ID + 'Contextual';
	  var Menus = brackets.getModule('command/Menus'), AppInit = brackets.getModule('utils/AppInit'), Commands = brackets.getModule('command/Commands'), Editor = brackets.getModule('editor/Editor').Editor, NodeDomain = brackets.getModule('utils/NodeDomain'), FileSystem = brackets.getModule('filesystem/FileSystem'), EditorManager = brackets.getModule('editor/EditorManager'), NodeConnection = brackets.getModule('utils/NodeConnection'), ExtensionUtils = brackets.getModule('utils/ExtensionUtils'), CommandManager = brackets.getModule('command/CommandManager'), ProjectManager = brackets.getModule('project/ProjectManager'), DocumentManager = brackets.getModule('document/DocumentManager'), PreferencesManager = brackets.getModule('preferences/PreferencesManager');
	  var Strings = {
	      'BEAUTIFY_ON_SAVE': 'Beautify on save',
	      'FILE_ERROR': 'Could not determine file type',
	      'SASS_FORMAT': 'An error occurred formatting the SASS file',
	      'SASS_ERROR': 'You need to provide a path to the sass-convert program'
	    }, escodegen_jsx = __webpack_require__(2), esprima_fb = __webpack_require__(3);
	  var beautifyOnSave, settingsFileName = '.jsbeautifyrc', menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU), settings = {}, debugPreferences = PreferencesManager.getExtensionPrefs('debug'), beautifyPreferences = PreferencesManager.getExtensionPrefs(COMMAND_ID), oldBeautifyPreferences = PreferencesManager.getExtensionPrefs(OLD_COMMAND_ID), windowsCommand = {
	      key: 'Ctrl-Shift-L',
	      platform: 'win'
	    }, macCommand = {
	      key: 'Cmd-Shift-L',
	      platform: 'mac'
	    }, command = [
	      windowsCommand,
	      macCommand
	    ];
	  DEBUG_MODE = debugPreferences.get('showErrorsInStatusBar');
	  beautifyOnSave = beautifyPreferences.get('on_save') || false;
	  if (!beautifyOnSave) {
	    beautifyPreferences.set('on_save', false);
	    beautifyPreferences.save();
	  }
	  function __debug(msg, code) {
	    if (DEBUG_MODE) {
	      var m = '[brackets-beautify] :: ' + msg;
	      if (typeof msg !== 'string') {
	        m = msg;
	      }
	      if (code === 0) {
	        console.log(m);
	      } else {
	        console.error(m);
	      }
	    }
	  }
	  function _formatJavascript(unformattedText, indentChar, indentSize) {
	    var options = {
	      indent_size: indentSize,
	      indent_char: indentChar
	    };
	    var ast = esprima_fb.parse(unformattedText, {
	      loc: true,
	      range: true,
	      attachComment: true,
	      sourceType: 'module'
	    });
	    var formattedText = escodegen_jsx.generate(ast, {
	      format: {
	        indent: {
	          style: '  ',
	          base: 0,
	          adjustMultilineComment: true
	        },
	        newline: '\n',
	        space: ' ',
	        json: false,
	        renumber: false,
	        hexadecimal: false,
	        quotes: 'auto',
	        escapeless: false,
	        compact: false,
	        parentheses: true,
	        semicolons: true,
	        safeConcatenation: false
	      },
	      moz: {
	        starlessGenerator: false,
	        parenthesizedComprehensionBlock: false,
	        comprehensionExpressionStartsWithAssignment: false
	      },
	      parse: null,
	      comment: true,
	      directive: true,
	      verbatim: undefined
	    });
	    return formattedText;
	  }
	  function _formatHTML(unformattedText, indentChar, indentSize) {
	    var options = {
	      indent_size: indentSize,
	      indent_char: indentChar
	    };
	    var formattedText = html_beautify(unformattedText, $.extend(options, settings));
	    return formattedText;
	  }
	  function _formatCSS(unformattedText, indentChar, indentSize) {
	    var formattedText = css_beautify(unformattedText, {
	      indent_size: indentSize,
	      indent_char: indentChar
	    });
	    return formattedText;
	  }
	  function _formatSASS(indentChar, indentSize, callback) {
	    if (indentChar === '\t') {
	      indentSize = 't';
	    }
	    var path = beautifyPreferences.get('sassConvertPath');
	    if (!path) {
	      console.log('Fallback to old preference');
	      path = oldBeautifyPreferences.get('sassConvertPath');
	    }
	    if (!path) {
	      __debug(Strings.SASS_ERROR, 0);
	    }
	    var simpleDomain = new NodeDomain('sassformat', ExtensionUtils.getModulePath(module, 'node/SassFormatDomain'));
	    var fullPath = DocumentManager.getCurrentDocument().file.fullPath;
	    var parsePromise = simpleDomain.exec('parse', path, fullPath, indentSize);
	    parsePromise.done(function (res) {
	      return callback(null, res);
	    });
	    parsePromise.fail(function (err) {
	      return callback(err);
	    });
	  }
	  function batchUpdate(formattedText, isSelection) {
	    var editor = EditorManager.getCurrentFullEditor();
	    var cursor = editor.getCursorPos();
	    var scroll = editor.getScrollPos();
	    var doc = DocumentManager.getCurrentDocument();
	    var selection = editor.getSelection();
	    doc.batchOperation(function () {
	      if (settings.git_happy) {
	        formattedText += '\n';
	      }
	      if (isSelection) {
	        doc.replaceRange(formattedText, selection.start, selection.end);
	      } else {
	        doc.setText(formattedText);
	      }
	      editor.setCursorPos(cursor);
	      editor.setScrollPos(scroll.x, scroll.y);
	    });
	  }
	  function format(autoSave) {
	    var indentChar, indentSize, formattedText;
	    var unformattedText, isSelection = false;
	    var useTabs = Editor.getUseTabChar();
	    __debug(settings, 0);
	    if (useTabs) {
	      indentChar = '\t';
	      indentSize = 1;
	    } else {
	      indentChar = ' ';
	      indentSize = Editor.getSpaceUnits();
	    }
	    var editor = EditorManager.getCurrentFullEditor();
	    var selectedText = editor.getSelectedText();
	    var selection = editor.getSelection();
	    if (selectedText.length > 0) {
	      isSelection = true;
	      unformattedText = selectedText;
	    } else {
	      unformattedText = DocumentManager.getCurrentDocument().getText();
	    }
	    var doc = DocumentManager.getCurrentDocument();
	    var language = doc.getLanguage();
	    var fileType = language._id;
	    switch (fileType) {
	    case 'javascript':
	    case 'jsx':
	    case 'json':
	      formattedText = _formatJavascript(unformattedText, indentChar, indentSize);
	      batchUpdate(formattedText, isSelection);
	      break;
	    case 'html':
	    case 'php':
	    case 'xml':
	    case 'ejs':
	      formattedText = _formatHTML(unformattedText, indentChar, indentSize);
	      batchUpdate(formattedText, isSelection);
	      break;
	    case 'css':
	    case 'less':
	      formattedText = _formatCSS(unformattedText, indentChar, indentSize);
	      batchUpdate(formattedText, isSelection);
	      break;
	    case 'scss':
	      _formatSASS(indentChar, indentSize, function (err, res) {
	        if (err) {
	          console.log(err);
	          formattedText = _formatCSS(unformattedText, indentChar, indentSize);
	          batchUpdate(formattedText, isSelection);
	        } else {
	          batchUpdate(res, false);
	        }
	      });
	      break;
	    default:
	      if (!autoSave) {
	        alert(Strings.FILE_ERROR);
	      }
	      return;
	    }
	  }
	  function onSave(event, doc) {
	    if (event.timeStamp - localStorage.getItem(COMMAND_TIMESTAMP) > 1000) {
	      format(true);
	      localStorage.setItem(COMMAND_TIMESTAMP, event.timeStamp);
	      CommandManager.execute(Commands.FILE_SAVE, { doc: doc });
	    }
	  }
	  function loadConfig() {
	    var settingsFile = FileSystem.getFileForPath(ProjectManager.getProjectRoot().fullPath + settingsFileName);
	    settingsFile.read(function (err, content) {
	      if (content) {
	        try {
	          settings = JSON.parse(content);
	          __debug('settings loaded' + settings, 0);
	        } catch (e) {
	          __debug('error parsing ' + settingsFile + '. Details: ' + e);
	          return;
	        }
	      }
	    });
	  }
	  function toggle(command, fromCheckbox) {
	    var newValue = typeof fromCheckbox === 'undefined' ? beautifyOnSave : fromCheckbox;
	    $(DocumentManager)[newValue ? 'on' : 'off']('documentSaved', onSave);
	    command.setChecked(newValue);
	    beautifyPreferences.set('on_save', newValue);
	    beautifyPreferences.save();
	  }
	  CommandManager.register('Beautify', COMMAND_ID, format);
	  var commandOnSave = CommandManager.register(Strings.BEAUTIFY_ON_SAVE, COMMAND_SAVE_ID, function () {
	    toggle(this, !this.getChecked());
	    if (this.getChecked()) {
	      localStorage.setItem(COMMAND_TIMESTAMP, 0);
	    }
	  });
	  CommandManager.register('Beautify', CONTEXTUAL_COMMAND_ID, format);
	  var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
	  contextMenu.addMenuItem(CONTEXTUAL_COMMAND_ID);
	  toggle(commandOnSave);
	  menu.addMenuDivider();
	  menu.addMenuItem(COMMAND_ID, command);
	  menu.addMenuItem(COMMAND_SAVE_ID);
	  AppInit.appReady(function () {
	    $(DocumentManager).on('documentRefreshed.beautify', function (e, document) {
	      if (document.file.fullPath === ProjectManager.getProjectRoot().fullPath + settingsFileName) {
	        loadConfig();
	      }
	    });
	    $(ProjectManager).on('projectOpen.beautify', function () {
	      loadConfig();
	    });
	    loadConfig();
	  });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    var code = __webpack_require__(9);

	    function isStrictModeReservedWordES6(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isKeywordES5(id, strict) {
	        // yield should not be treated as keyword under non-strict mode.
	        if (!strict && id === 'yield') {
	            return false;
	        }
	        return isKeywordES6(id, strict);
	    }

	    function isKeywordES6(id, strict) {
	        if (strict && isStrictModeReservedWordES6(id)) {
	            return true;
	        }

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    function isReservedWordES5(id, strict) {
	        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
	    }

	    function isReservedWordES6(id, strict) {
	        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    function isIdentifierName(id) {
	        var i, iz, ch;

	        if (id.length === 0) {
	            return false;
	        }

	        ch = id.charCodeAt(0);
	        if (!code.isIdentifierStart(ch) || ch === 92) {  // \ (backslash)
	            return false;
	        }

	        for (i = 1, iz = id.length; i < iz; ++i) {
	            ch = id.charCodeAt(i);
	            if (!code.isIdentifierPart(ch) || ch === 92) {  // \ (backslash)
	                return false;
	            }
	        }
	        return true;
	    }

	    function isIdentifierES5(id, strict) {
	        return isIdentifierName(id) && !isReservedWordES5(id, strict);
	    }

	    function isIdentifierES6(id, strict) {
	        return isIdentifierName(id) && !isReservedWordES6(id, strict);
	    }

	    module.exports = {
	        isKeywordES5: isKeywordES5,
	        isKeywordES6: isKeywordES6,
	        isReservedWordES5: isReservedWordES5,
	        isReservedWordES6: isReservedWordES6,
	        isRestrictedWord: isRestrictedWord,
	        isIdentifierName: isIdentifierName,
	        isIdentifierES5: isIdentifierES5,
	        isIdentifierES6: isIdentifierES6
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	  Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
	  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
	  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
	  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
	  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
	  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/*global exports:true, require:true, global:true*/
	(function () {
	    'use strict';

	    var Syntax,
	        Precedence,
	        BinaryPrecedence,
	        SourceNode,
	        estraverse,
	        esutils,
	        isArray,
	        base,
	        indent,
	        json,
	        renumber,
	        hexadecimal,
	        quotes,
	        escapeless,
	        newline,
	        space,
	        parentheses,
	        semicolons,
	        safeConcatenation,
	        directive,
	        extra,
	        parse,
	        sourceMap,
	        FORMAT_MINIFY,
	        FORMAT_DEFAULTS;

	    estraverse = __webpack_require__(4);
	    esutils = __webpack_require__(5);

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ComprehensionBlock: 'ComprehensionBlock',
	        ComprehensionExpression: 'ComprehensionExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportBatchSpecifier: 'ExportBatchSpecifier',
	        ExportDeclaration: 'ExportDeclaration',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        GeneratorExpression: 'GeneratorExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        ModuleSpecifier: 'ModuleSpecifier',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression',

	        XJSAttribute: 'XJSAttribute',
	        XJSClosingElement: 'XJSClosingElement',
	        XJSElement: 'XJSElement',
	        XJSExpressionContainer: 'XJSExpressionContainer',
	        XJSIdentifier: 'XJSIdentifier',
	        XJSMemberExpression: 'XJSMemberExpression',
	        XJSNamespacedName: 'XJSNamespacedName',
	        XJSOpeningElement: 'XJSOpeningElement'
	    };

	    // Generation is done by generateExpression.
	    function isExpression(node) {
	        return CodeGenerator.Expression.hasOwnProperty(node.type);
	    }

	    // Generation is done by generateStatement.
	    function isStatement(node) {
	        return CodeGenerator.Statement.hasOwnProperty(node.type);
	    }

	    Precedence = {
	        Sequence: 0,
	        Yield: 1,
	        Assignment: 1,
	        Conditional: 2,
	        ArrowFunction: 2,
	        LogicalOR: 3,
	        LogicalAND: 4,
	        BitwiseOR: 5,
	        BitwiseXOR: 6,
	        BitwiseAND: 7,
	        Equality: 8,
	        Relational: 9,
	        BitwiseSHIFT: 10,
	        Additive: 11,
	        Multiplicative: 12,
	        Unary: 13,
	        Postfix: 14,
	        Call: 15,
	        New: 16,
	        TaggedTemplate: 17,
	        Member: 18,
	        Primary: 19
	    };

	    BinaryPrecedence = {
	        '||': Precedence.LogicalOR,
	        '&&': Precedence.LogicalAND,
	        '|': Precedence.BitwiseOR,
	        '^': Precedence.BitwiseXOR,
	        '&': Precedence.BitwiseAND,
	        '==': Precedence.Equality,
	        '!=': Precedence.Equality,
	        '===': Precedence.Equality,
	        '!==': Precedence.Equality,
	        'is': Precedence.Equality,
	        'isnt': Precedence.Equality,
	        '<': Precedence.Relational,
	        '>': Precedence.Relational,
	        '<=': Precedence.Relational,
	        '>=': Precedence.Relational,
	        'in': Precedence.Relational,
	        'instanceof': Precedence.Relational,
	        '<<': Precedence.BitwiseSHIFT,
	        '>>': Precedence.BitwiseSHIFT,
	        '>>>': Precedence.BitwiseSHIFT,
	        '+': Precedence.Additive,
	        '-': Precedence.Additive,
	        '*': Precedence.Multiplicative,
	        '%': Precedence.Multiplicative,
	        '/': Precedence.Multiplicative
	    };

	    //Flags
	    var F_ALLOW_IN = 1,
	        F_ALLOW_CALL = 1 << 1,
	        F_ALLOW_UNPARATH_NEW = 1 << 2,
	        F_FUNC_BODY = 1 << 3,
	        F_DIRECTIVE_CTX = 1 << 4,
	        F_SEMICOLON_OPT = 1 << 5;

	    var F_XJS_NOINDENT = 1 << 8,
	        F_XJS_NOPAREN = 1 << 9;

	    //Expression flag sets
	    //NOTE: Flag order:
	    // F_ALLOW_IN
	    // F_ALLOW_CALL
	    // F_ALLOW_UNPARATH_NEW
	    var E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
	        E_TTF = F_ALLOW_IN | F_ALLOW_CALL,
	        E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
	        E_TFF = F_ALLOW_IN,
	        E_FFT = F_ALLOW_UNPARATH_NEW,
	        E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;

	    //Statement flag sets
	    //NOTE: Flag order:
	    // F_ALLOW_IN
	    // F_FUNC_BODY
	    // F_DIRECTIVE_CTX
	    // F_SEMICOLON_OPT
	    var S_TFFF = F_ALLOW_IN,
	        S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT,
	        S_FFFF = 0x00,
	        S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX,
	        S_TTFF = F_ALLOW_IN | F_FUNC_BODY;

	    function getDefaultOptions() {
	        // default options
	        return {
	            indent: null,
	            base: null,
	            parse: null,
	            comment: false,
	            format: {
	                indent: {
	                    style: '    ',
	                    base: 0,
	                    adjustMultilineComment: false
	                },
	                newline: '\n',
	                space: ' ',
	                json: false,
	                renumber: false,
	                hexadecimal: false,
	                quotes: 'single',
	                escapeless: false,
	                compact: false,
	                parentheses: true,
	                semicolons: true,
	                safeConcatenation: false
	            },
	            moz: {
	                comprehensionExpressionStartsWithAssignment: false,
	                starlessGenerator: false
	            },
	            sourceMap: null,
	            sourceMapRoot: null,
	            sourceMapWithCode: false,
	            directive: false,
	            raw: true,
	            verbatim: null
	        };
	    }

	    function stringRepeat(str, num) {
	        var result = '';

	        for (num |= 0; num > 0; num >>>= 1, str += str) {
	            if (num & 1) {
	                result += str;
	            }
	        }

	        return result;
	    }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function hasLineTerminator(str) {
	        return (/[\r\n]/g).test(str);
	    }

	    function endsWithLineTerminator(str) {
	        var len = str.length;
	        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
	    }

	    function merge(target, override) {
	        var key;
	        for (key in override) {
	            if (override.hasOwnProperty(key)) {
	                target[key] = override[key];
	            }
	        }
	        return target;
	    }

	    function updateDeeply(target, override) {
	        var key, val;

	        function isHashObject(target) {
	            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
	        }

	        for (key in override) {
	            if (override.hasOwnProperty(key)) {
	                val = override[key];
	                if (isHashObject(val)) {
	                    if (isHashObject(target[key])) {
	                        updateDeeply(target[key], val);
	                    } else {
	                        target[key] = updateDeeply({}, val);
	                    }
	                } else {
	                    target[key] = val;
	                }
	            }
	        }
	        return target;
	    }

	    function generateNumber(value) {
	        var result, point, temp, exponent, pos;

	        if (value !== value) {
	            throw new Error('Numeric literal whose value is NaN');
	        }
	        if (value < 0 || (value === 0 && 1 / value < 0)) {
	            throw new Error('Numeric literal whose value is negative');
	        }

	        if (value === 1 / 0) {
	            return json ? 'null' : renumber ? '1e400' : '1e+400';
	        }

	        result = '' + value;
	        if (!renumber || result.length < 3) {
	            return result;
	        }

	        point = result.indexOf('.');
	        if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
	            point = 0;
	            result = result.slice(1);
	        }
	        temp = result;
	        result = result.replace('e+', 'e');
	        exponent = 0;
	        if ((pos = temp.indexOf('e')) > 0) {
	            exponent = +temp.slice(pos + 1);
	            temp = temp.slice(0, pos);
	        }
	        if (point >= 0) {
	            exponent -= temp.length - point - 1;
	            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
	        }
	        pos = 0;
	        while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
	            --pos;
	        }
	        if (pos !== 0) {
	            exponent -= pos;
	            temp = temp.slice(0, pos);
	        }
	        if (exponent !== 0) {
	            temp += 'e' + exponent;
	        }
	        if ((temp.length < result.length ||
	                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
	                +temp === value) {
	            result = temp;
	        }

	        return result;
	    }

	    // Generate valid RegExp expression.
	    // This function is based on https://github.com/Constellation/iv Engine

	    function escapeRegExpCharacter(ch, previousIsBackslash) {
	        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
	        if ((ch & ~1) === 0x2028) {
	            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
	        } else if (ch === 10 || ch === 13) {  // \n, \r
	            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
	        }
	        return String.fromCharCode(ch);
	    }

	    function generateRegExp(reg) {
	        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

	        result = reg.toString();

	        if (reg.source) {
	            // extract flag from toString result
	            match = result.match(/\/([^/]*)$/);
	            if (!match) {
	                return result;
	            }

	            flags = match[1];
	            result = '';

	            characterInBrack = false;
	            previousIsBackslash = false;
	            for (i = 0, iz = reg.source.length; i < iz; ++i) {
	                ch = reg.source.charCodeAt(i);

	                if (!previousIsBackslash) {
	                    if (characterInBrack) {
	                        if (ch === 93) {  // ]
	                            characterInBrack = false;
	                        }
	                    } else {
	                        if (ch === 47) {  // /
	                            result += '\\';
	                        } else if (ch === 91) {  // [
	                            characterInBrack = true;
	                        }
	                    }
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    previousIsBackslash = ch === 92;  // \
	                } else {
	                    // if new RegExp("\\\n') is provided, create /\n/
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    // prevent like /\\[/]/
	                    previousIsBackslash = false;
	                }
	            }

	            return '/' + result + '/' + flags;
	        }

	        return result;
	    }

	    function escapeAllowedCharacter(code, next) {
	        var hex;

	        if (code === 0x08  /* \b */) {
	            return '\\b';
	        }

	        if (code === 0x0C  /* \f */) {
	            return '\\f';
	        }

	        if (code === 0x09  /* \t */) {
	            return '\\t';
	        }

	        hex = code.toString(16).toUpperCase();
	        if (json || code > 0xFF) {
	            return '\\u' + '0000'.slice(hex.length) + hex;
	        } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
	            return '\\0';
	        } else if (code === 0x000B  /* \v */) { // '\v'
	            return '\\x0B';
	        } else {
	            return '\\x' + '00'.slice(hex.length) + hex;
	        }
	    }

	    function escapeDisallowedCharacter(code) {
	        if (code === 0x5C  /* \ */) {
	            return '\\\\';
	        }

	        if (code === 0x0A  /* \n */) {
	            return '\\n';
	        }

	        if (code === 0x0D  /* \r */) {
	            return '\\r';
	        }

	        if (code === 0x2028) {
	            return '\\u2028';
	        }

	        if (code === 0x2029) {
	            return '\\u2029';
	        }

	        throw new Error('Incorrectly classified character');
	    }

	    function escapeDirective(str) {
	        var i, iz, code, quote;

	        quote = quotes === 'double' ? '"' : '\'';
	        for (i = 0, iz = str.length; i < iz; ++i) {
	            code = str.charCodeAt(i);
	            if (code === 0x27  /* ' */) {
	                quote = '"';
	                break;
	            } else if (code === 0x22  /* " */) {
	                quote = '\'';
	                break;
	            } else if (code === 0x5C  /* \ */) {
	                ++i;
	            }
	        }

	        return quote + str + quote;
	    }

	    function escapeString(str) {
	        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

	        for (i = 0, len = str.length; i < len; ++i) {
	            code = str.charCodeAt(i);
	            if (code === 0x27  /* ' */) {
	                ++singleQuotes;
	            } else if (code === 0x22  /* " */) {
	                ++doubleQuotes;
	            } else if (code === 0x2F  /* / */ && json) {
	                result += '\\';
	            } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
	                result += escapeDisallowedCharacter(code);
	                continue;
	            } else if ((json && code < 0x20  /* SP */) || !(json || escapeless || (code >= 0x20  /* SP */ && code <= 0x7E  /* ~ */))) {
	                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
	                continue;
	            }
	            result += String.fromCharCode(code);
	        }

	        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
	        quote = single ? '\'' : '"';

	        if (!(single ? singleQuotes : doubleQuotes)) {
	            return quote + result + quote;
	        }

	        str = result;
	        result = quote;

	        for (i = 0, len = str.length; i < len; ++i) {
	            code = str.charCodeAt(i);
	            if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
	                result += '\\';
	            }
	            result += String.fromCharCode(code);
	        }

	        return result + quote;
	    }

	    /**
	     * flatten an array to a string, where the array can contain
	     * either strings or nested arrays
	     */
	    function flattenToString(arr) {
	        var i, iz, elem, result = '';
	        for (i = 0, iz = arr.length; i < iz; ++i) {
	            elem = arr[i];
	            result += isArray(elem) ? flattenToString(elem) : elem;
	        }
	        return result;
	    }

	    /**
	     * convert generated to a SourceNode when source maps are enabled.
	     */
	    function toSourceNodeWhenNeeded(generated, node) {
	        if (!sourceMap) {
	            // with no source maps, generated is either an
	            // array or a string.  if an array, flatten it.
	            // if a string, just return it
	            if (isArray(generated)) {
	                return flattenToString(generated);
	            } else {
	                return generated;
	            }
	        }
	        if (node == null) {
	            if (generated instanceof SourceNode) {
	                return generated;
	            } else {
	                node = {};
	            }
	        }
	        if (node.loc == null) {
	            return new SourceNode(null, null, sourceMap, generated, node.name || null);
	        }
	        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
	    }

	    function noEmptySpace() {
	        return (space) ? space : ' ';
	    }

	    function join(left, right) {
	        var leftSource,
	            rightSource,
	            leftCharCode,
	            rightCharCode;

	        leftSource = toSourceNodeWhenNeeded(left).toString();
	        if (leftSource.length === 0) {
	            return [right];
	        }

	        rightSource = toSourceNodeWhenNeeded(right).toString();
	        if (rightSource.length === 0) {
	            return [left];
	        }

	        leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
	        rightCharCode = rightSource.charCodeAt(0);

	        if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
	            esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode) ||
	            leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
	            return [left, noEmptySpace(), right];
	        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
	                esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
	            return [left, right];
	        }
	        return [left, space, right];
	    }

	    function addIndent(stmt) {
	        return [base, stmt];
	    }

	    function withIndent(fn) {
	        var previousBase;
	        previousBase = base;
	        base += indent;
	        fn(base);
	        base = previousBase;
	    }

	    function calculateSpaces(str) {
	        var i;
	        for (i = str.length - 1; i >= 0; --i) {
	            if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
	                break;
	            }
	        }
	        return (str.length - 1) - i;
	    }

	    function adjustMultilineComment(value, specialBase) {
	        var array, i, len, line, j, spaces, previousBase, sn;

	        array = value.split(/\r\n|[\r\n]/);
	        spaces = Number.MAX_VALUE;

	        // first line doesn't have indentation
	        for (i = 1, len = array.length; i < len; ++i) {
	            line = array[i];
	            j = 0;
	            while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
	                ++j;
	            }
	            if (spaces > j) {
	                spaces = j;
	            }
	        }

	        if (typeof specialBase !== 'undefined') {
	            // pattern like
	            // {
	            //   var t = 20;  /*
	            //                 * this is comment
	            //                 */
	            // }
	            previousBase = base;
	            if (array[1][spaces] === '*') {
	                specialBase += ' ';
	            }
	            base = specialBase;
	        } else {
	            if (spaces & 1) {
	                // /*
	                //  *
	                //  */
	                // If spaces are odd number, above pattern is considered.
	                // We waste 1 space.
	                --spaces;
	            }
	            previousBase = base;
	        }

	        for (i = 1, len = array.length; i < len; ++i) {
	            sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
	            array[i] = sourceMap ? sn.join('') : sn;
	        }

	        base = previousBase;

	        return array.join('\n');
	    }

	    function generateComment(comment, specialBase) {
	        if (comment.type === 'Line') {
	            if (endsWithLineTerminator(comment.value)) {
	                return '//' + comment.value;
	            } else {
	                // Always use LineTerminator
	                return '//' + comment.value + '\n';
	            }
	        }
	        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
	            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
	        }
	        return '/*' + comment.value + '*/';
	    }

	    function addComments(stmt, result) {
	        var i, len, comment, save, tailingToStatement, specialBase, fragment;

	        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
	            save = result;

	            comment = stmt.leadingComments[0];
	            result = [];
	            if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
	                result.push('\n');
	            }
	            result.push(generateComment(comment));
	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push('\n');
	            }

	            for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
	                comment = stmt.leadingComments[i];
	                fragment = [generateComment(comment)];
	                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    fragment.push('\n');
	                }
	                result.push(addIndent(fragment));
	            }

	            result.push(addIndent(save));
	        }

	        if (stmt.trailingComments) {
	            tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
	            specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
	            for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
	                comment = stmt.trailingComments[i];
	                if (tailingToStatement) {
	                    // We assume target like following script
	                    //
	                    // var t = 20;  /**
	                    //               * This is comment of t
	                    //               */
	                    if (i === 0) {
	                        // first case
	                        result = [result, indent];
	                    } else {
	                        result = [result, specialBase];
	                    }
	                    result.push(generateComment(comment, specialBase));
	                } else {
	                    result = [result, addIndent(generateComment(comment))];
	                }
	                if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    result = [result, '\n'];
	                }
	            }
	        }

	        return result;
	    }

	    function parenthesize(text, current, should) {
	        if (current < should) {
	            return ['(', text, ')'];
	        }
	        return text;
	    }

	    function generateVerbatimString(string) {
	        var i, iz, result;
	        result = string.split(/\r\n|\n/);
	        for (i = 1, iz = result.length; i < iz; i++) {
	            result[i] = newline + base + result[i];
	        }
	        return result;
	    }

	    function generateVerbatim(expr, precedence) {
	        var verbatim, result, prec;
	        verbatim = expr[extra.verbatim];

	        if (typeof verbatim === 'string') {
	            result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence);
	        } else {
	            // verbatim is object
	            result = generateVerbatimString(verbatim.content);
	            prec = (verbatim.precedence != null) ? verbatim.precedence : Precedence.Sequence;
	            result = parenthesize(result, prec, precedence);
	        }

	        return toSourceNodeWhenNeeded(result, expr);
	    }

	    function CodeGenerator() {
	    }

	    // Helpers.

	    CodeGenerator.prototype.maybeBlock = function(stmt, flags) {
	        var result, noLeadingComment, that = this;

	        noLeadingComment = !extra.comment || !stmt.leadingComments;

	        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
	            return [space, this.generateStatement(stmt, flags)];
	        }

	        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
	            return ';';
	        }

	        withIndent(function () {
	            result = [
	                newline,
	                addIndent(that.generateStatement(stmt, flags))
	            ];
	        });

	        return result;
	    };

	    CodeGenerator.prototype.maybeBlockSuffix = function (stmt, result) {
	        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
	        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
	            return [result, space];
	        }
	        if (ends) {
	            return [result, base];
	        }
	        return [result, newline, base];
	    };

	    function generateIdentifier(node) {
	        return toSourceNodeWhenNeeded(node.name, node);
	    }

	    CodeGenerator.prototype.generatePattern = function (node, precedence, flags) {
	        if (node.type === Syntax.Identifier) {
	            return generateIdentifier(node);
	        }
	        return this.generateExpression(node, precedence, flags);
	    };

	    CodeGenerator.prototype.generateFunctionParams = function (node) {
	        var i, iz, result, hasDefault;

	        hasDefault = false;

	        if (node.type === Syntax.ArrowFunctionExpression &&
	                !node.rest && (!node.defaults || node.defaults.length === 0) &&
	                node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
	            // arg => { } case
	            result = [generateIdentifier(node.params[0])];
	        } else {
	            result = ['('];
	            if (node.defaults) {
	                hasDefault = true;
	            }
	            for (i = 0, iz = node.params.length; i < iz; ++i) {
	                if (hasDefault && node.defaults[i]) {
	                    // Handle default values.
	                    result.push(this.generateAssignment(node.params[i], node.defaults[i], '=', Precedence.Assignment, E_TTT));
	                } else {
	                    result.push(this.generatePattern(node.params[i], Precedence.Assignment, E_TTT));
	                }
	                if (i + 1 < iz) {
	                    result.push(',' + space);
	                }
	            }

	            if (node.rest) {
	                if (node.params.length) {
	                    result.push(',' + space);
	                }
	                result.push('...');
	                result.push(generateIdentifier(node.rest));
	            }

	            result.push(')');
	        }

	        return result;
	    };

	    CodeGenerator.prototype.generateFunctionBody = function (node) {
	        var result, expr;

	        result = this.generateFunctionParams(node);

	        if (node.type === Syntax.ArrowFunctionExpression) {
	            result.push(space);
	            result.push('=>');
	        }

	        if (node.expression) {
	            result.push(space);
	            expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT);
	            if (expr.toString().charAt(0) === '{') {
	                expr = ['(', expr, ')'];
	            }
	            result.push(expr);
	        } else {
	            result.push(this.maybeBlock(node.body, S_TTFF));
	        }

	        return result;
	    };

	    CodeGenerator.prototype.generateIterationForStatement = function (operator, stmt, flags) {
	        var result = ['for' + space + '('], that = this;
	        withIndent(function () {
	            if (stmt.left.type === Syntax.VariableDeclaration) {
	                withIndent(function () {
	                    result.push(stmt.left.kind + noEmptySpace());
	                    result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
	                });
	            } else {
	                result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT));
	            }

	            result = join(result, operator);
	            result = [join(
	                result,
	                that.generateExpression(stmt.right, Precedence.Sequence, E_TTT)
	            ), ')'];
	        });
	        result.push(this.maybeBlock(stmt.body, flags));
	        return result;
	    };

	    CodeGenerator.prototype.generatePropertyKey = function (expr, computed) {
	        var result = [];

	        if (computed) {
	            result.push('[');
	        }

	        result.push(this.generateExpression(expr, Precedence.Sequence, E_TTT));
	        if (computed) {
	            result.push(']');
	        }

	        return result;
	    };

	    CodeGenerator.prototype.generateAssignment = function (left, right, operator, precedence, flags) {
	        if (Precedence.Assignment < precedence) {
	            flags |= F_ALLOW_IN;
	        }

	        return parenthesize(
	            [
	                this.generateExpression(left, Precedence.Call, flags),
	                space + operator + space,
	                this.generateExpression(right, Precedence.Assignment, flags)
	            ],
	            Precedence.Assignment,
	            precedence
	        );
	    };

	    CodeGenerator.prototype.semicolon = function (flags) {
	        if (!semicolons && flags & F_SEMICOLON_OPT) {
	            return '';
	        }
	        return ';';
	    };

	    // Statements.

	    CodeGenerator.Statement = {

	        BlockStatement: function (stmt, flags) {
	            var result = ['{', newline], that = this;

	            withIndent(function () {
	                var i, iz, fragment, bodyFlags;
	                bodyFlags = S_TFFF;
	                if (flags & F_FUNC_BODY) {
	                    bodyFlags |= F_DIRECTIVE_CTX;
	                }
	                for (i = 0, iz = stmt.body.length; i < iz; ++i) {
	                    if (i === iz - 1) {
	                        bodyFlags |= F_SEMICOLON_OPT;
	                    }
	                    fragment = addIndent(that.generateStatement(stmt.body[i], bodyFlags));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });

	            result.push(addIndent('}'));
	            return result;
	        },

	        BreakStatement: function (stmt, flags) {
	            if (stmt.label) {
	                return 'break ' + stmt.label.name + this.semicolon(flags);
	            }
	            return 'break' + this.semicolon(flags);
	        },

	        ContinueStatement: function (stmt, flags) {
	            if (stmt.label) {
	                return 'continue ' + stmt.label.name + this.semicolon(flags);
	            }
	            return 'continue' + this.semicolon(flags);
	        },

	        ClassBody: function (stmt, flags) {
	            var result = [ '{', newline], that = this;

	            withIndent(function (indent) {
	                var i, iz;

	                for (i = 0, iz = stmt.body.length; i < iz; ++i) {
	                    result.push(indent);
	                    result.push(that.generateExpression(stmt.body[i], Precedence.Sequence, E_TTT));
	                    if (i + 1 < iz) {
	                        result.push(newline);
	                    }
	                }
	            });

	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(base);
	            result.push('}');
	            return result;
	        },

	        ClassDeclaration: function (stmt, flags) {
	            var result, fragment;
	            result  = ['class ' + stmt.id.name];
	            if (stmt.superClass) {
	                fragment = join('extends', this.generateExpression(stmt.superClass, Precedence.Assignment, E_TTT));
	                result = join(result, fragment);
	            }
	            result.push(space);
	            result.push(this.generateStatement(stmt.body, S_TFFT));
	            return result;
	        },

	        DirectiveStatement: function (stmt, flags) {
	            if (extra.raw && stmt.raw) {
	                return stmt.raw + this.semicolon(flags);
	            }
	            return escapeDirective(stmt.directive) + this.semicolon(flags);
	        },

	        DoWhileStatement: function (stmt, flags) {
	            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
	            var result = join('do', this.maybeBlock(stmt.body, S_TFFF));
	            result = this.maybeBlockSuffix(stmt.body, result);
	            return join(result, [
	                'while' + space + '(',
	                this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
	                ')' + this.semicolon(flags)
	            ]);
	        },

	        CatchClause: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                var guard;

	                result = [
	                    'catch' + space + '(',
	                    that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
	                    ')'
	                ];

	                if (stmt.guard) {
	                    guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT);
	                    result.splice(2, 0, ' if ', guard);
	                }
	            });
	            result.push(this.maybeBlock(stmt.body, S_TFFF));
	            return result;
	        },

	        DebuggerStatement: function (stmt, flags) {
	            return 'debugger' + this.semicolon(flags);
	        },

	        EmptyStatement: function (stmt, flags) {
	            return ';';
	        },

	        ExportDeclaration: function (stmt, flags) {
	            var result = [ 'export' ], bodyFlags, that = this;

	            bodyFlags = (flags & F_SEMICOLON_OPT) ? S_TFFT : S_TFFF;

	            // export default HoistableDeclaration[Default]
	            // export default AssignmentExpression[In] ;
	            if (stmt['default']) {
	                result = join(result, 'default');
	                if (isStatement(stmt.declaration)) {
	                    result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
	                } else {
	                    result = join(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags));
	                }
	                return result;
	            }

	            // export VariableStatement
	            // export Declaration[Default]
	            if (stmt.declaration) {
	                return join(result, this.generateStatement(stmt.declaration, bodyFlags));
	            }

	            // export * FromClause ;
	            // export ExportClause[NoReference] FromClause ;
	            // export ExportClause ;
	            if (stmt.specifiers) {
	                if (stmt.specifiers.length === 0) {
	                    result = join(result, '{' + space + '}');
	                } else if (stmt.specifiers[0].type === Syntax.ExportBatchSpecifier) {
	                    result = join(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT));
	                } else {
	                    result = join(result, '{');
	                    withIndent(function (indent) {
	                        var i, iz;
	                        result.push(newline);
	                        for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
	                            result.push(indent);
	                            result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
	                            if (i + 1 < iz) {
	                                result.push(',' + newline);
	                            }
	                        }
	                    });
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                        result.push(newline);
	                    }
	                    result.push(base + '}');
	                }

	                if (stmt.source) {
	                    result = join(result, [
	                        'from' + space,
	                        // ModuleSpecifier
	                        this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
	                        this.semicolon(flags)
	                    ]);
	                } else {
	                    result.push(this.semicolon(flags));
	                }
	            }
	            return result;
	        },

	        ExpressionStatement: function (stmt, flags) {
	            var result, fragment;

	            result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT | F_XJS_NOINDENT)];
	            // 12.4 '{', 'function', 'class' is not allowed in this position.
	            // wrap expression with parentheses
	            fragment = toSourceNodeWhenNeeded(result).toString();
	            if (fragment.charAt(0) === '{' ||  // ObjectExpression
	                    (fragment.slice(0, 5) === 'class' && ' {'.indexOf(fragment.charAt(5)) >= 0) ||  // class
	                    (fragment.slice(0, 8) === 'function' && '* ('.indexOf(fragment.charAt(8)) >= 0) ||  // function or generator
	                    (directive && (flags & F_DIRECTIVE_CTX) && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
	                result = ['(', result, ')' + this.semicolon(flags)];
	            } else {
	                result.push(this.semicolon(flags));
	            }
	            return result;
	        },

	        ImportDeclaration: function (stmt, flags) {
	            // ES6: 15.2.1 valid import declarations:
	            //     - import ImportClause FromClause ;
	            //     - import ModuleSpecifier ;
	            var result, cursor, that = this;

	            // If no ImportClause is present,
	            // this should be `import ModuleSpecifier` so skip `from`
	            // ModuleSpecifier is StringLiteral.
	            if (stmt.specifiers.length === 0) {
	                // import ModuleSpecifier ;
	                return [
	                    'import',
	                    space,
	                    // ModuleSpecifier
	                    this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
	                    this.semicolon(flags)
	                ];
	            }

	            // import ImportClause FromClause ;
	            result = [
	                'import'
	            ];
	            cursor = 0;

	            // ImportedBinding
	            if (stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier) {
	                result = join(result, [
	                        this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
	                ]);
	                ++cursor;
	            }

	            if (stmt.specifiers[cursor]) {
	                if (cursor !== 0) {
	                    result.push(',');
	                }

	                if (stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier) {
	                    // NameSpaceImport
	                    result = join(result, [
	                            space,
	                            this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
	                    ]);
	                } else {
	                    // NamedImports
	                    result.push(space + '{');

	                    if ((stmt.specifiers.length - cursor) === 1) {
	                        // import { ... } from "...";
	                        result.push(space);
	                        result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT));
	                        result.push(space + '}' + space);
	                    } else {
	                        // import {
	                        //    ...,
	                        //    ...,
	                        // } from "...";
	                        withIndent(function (indent) {
	                            var i, iz;
	                            result.push(newline);
	                            for (i = cursor, iz = stmt.specifiers.length; i < iz; ++i) {
	                                result.push(indent);
	                                result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
	                                if (i + 1 < iz) {
	                                    result.push(',' + newline);
	                                }
	                            }
	                        });
	                        if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                            result.push(newline);
	                        }
	                        result.push(base + '}' + space);
	                    }
	                }
	            }

	            result = join(result, [
	                'from' + space,
	                // ModuleSpecifier
	                this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
	                this.semicolon(flags)
	            ]);
	            return result;
	        },

	        VariableDeclarator: function (stmt, flags) {
	            var itemFlags = (flags & F_ALLOW_IN) ? E_TTT : E_FTT;
	            if (stmt.init) {
	                return [
	                    this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
	                    space,
	                    '=',
	                    space,
	                    this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
	                ];
	            }
	            return this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
	        },

	        VariableDeclaration: function (stmt, flags) {
	            // VariableDeclarator is typed as Statement,
	            // but joined with comma (not LineTerminator).
	            // So if comment is attached to target node, we should specialize.
	            var result, i, iz, node, bodyFlags, that = this;

	            result = [ stmt.kind ];

	            bodyFlags = (flags & F_ALLOW_IN) ? S_TFFF : S_FFFF;

	            function block() {
	                node = stmt.declarations[0];
	                if (extra.comment && node.leadingComments) {
	                    result.push('\n');
	                    result.push(addIndent(that.generateStatement(node, bodyFlags)));
	                } else {
	                    result.push(noEmptySpace());
	                    result.push(that.generateStatement(node, bodyFlags));
	                }

	                for (i = 1, iz = stmt.declarations.length; i < iz; ++i) {
	                    node = stmt.declarations[i];
	                    if (extra.comment && node.leadingComments) {
	                        result.push(',' + newline);
	                        result.push(addIndent(that.generateStatement(node, bodyFlags)));
	                    } else {
	                        result.push(',' + space);
	                        result.push(that.generateStatement(node, bodyFlags));
	                    }
	                }
	            }

	            if (stmt.declarations.length > 1) {
	                withIndent(block);
	            } else {
	                block();
	            }

	            result.push(this.semicolon(flags));

	            return result;
	        },

	        ThrowStatement: function (stmt, flags) {
	            return [join(
	                'throw',
	                this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
	            ), this.semicolon(flags)];
	        },

	        TryStatement: function (stmt, flags) {
	            var result, i, iz, guardedHandlers;

	            result = ['try', this.maybeBlock(stmt.block, S_TFFF)];
	            result = this.maybeBlockSuffix(stmt.block, result);

	            if (stmt.handlers) {
	                // old interface
	                for (i = 0, iz = stmt.handlers.length; i < iz; ++i) {
	                    result = join(result, this.generateStatement(stmt.handlers[i], S_TFFF));
	                    if (stmt.finalizer || i + 1 !== iz) {
	                        result = this.maybeBlockSuffix(stmt.handlers[i].body, result);
	                    }
	                }
	            } else {
	                guardedHandlers = stmt.guardedHandlers || [];

	                for (i = 0, iz = guardedHandlers.length; i < iz; ++i) {
	                    result = join(result, this.generateStatement(guardedHandlers[i], S_TFFF));
	                    if (stmt.finalizer || i + 1 !== iz) {
	                        result = this.maybeBlockSuffix(guardedHandlers[i].body, result);
	                    }
	                }

	                // new interface
	                if (stmt.handler) {
	                    if (isArray(stmt.handler)) {
	                        for (i = 0, iz = stmt.handler.length; i < iz; ++i) {
	                            result = join(result, this.generateStatement(stmt.handler[i], S_TFFF));
	                            if (stmt.finalizer || i + 1 !== iz) {
	                                result = this.maybeBlockSuffix(stmt.handler[i].body, result);
	                            }
	                        }
	                    } else {
	                        result = join(result, this.generateStatement(stmt.handler, S_TFFF));
	                        if (stmt.finalizer) {
	                            result = this.maybeBlockSuffix(stmt.handler.body, result);
	                        }
	                    }
	                }
	            }
	            if (stmt.finalizer) {
	                result = join(result, ['finally', this.maybeBlock(stmt.finalizer, S_TFFF)]);
	            }
	            return result;
	        },

	        SwitchStatement: function (stmt, flags) {
	            var result, fragment, i, iz, bodyFlags, that = this;
	            withIndent(function () {
	                result = [
	                    'switch' + space + '(',
	                    that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
	                    ')' + space + '{' + newline
	                ];
	            });
	            if (stmt.cases) {
	                bodyFlags = S_TFFF;
	                for (i = 0, iz = stmt.cases.length; i < iz; ++i) {
	                    if (i === iz - 1) {
	                        bodyFlags |= F_SEMICOLON_OPT;
	                    }
	                    fragment = addIndent(this.generateStatement(stmt.cases[i], bodyFlags));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            }
	            result.push(addIndent('}'));
	            return result;
	        },

	        SwitchCase: function (stmt, flags) {
	            var result, fragment, i, iz, bodyFlags, that = this;
	            withIndent(function () {
	                if (stmt.test) {
	                    result = [
	                        join('case', that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
	                        ':'
	                    ];
	                } else {
	                    result = ['default:'];
	                }

	                i = 0;
	                iz = stmt.consequent.length;
	                if (iz && stmt.consequent[0].type === Syntax.BlockStatement) {
	                    fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
	                    result.push(fragment);
	                    i = 1;
	                }

	                if (i !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    result.push(newline);
	                }

	                bodyFlags = S_TFFF;
	                for (; i < iz; ++i) {
	                    if (i === iz - 1 && flags & F_SEMICOLON_OPT) {
	                        bodyFlags |= F_SEMICOLON_OPT;
	                    }
	                    fragment = addIndent(that.generateStatement(stmt.consequent[i], bodyFlags));
	                    result.push(fragment);
	                    if (i + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });
	            return result;
	        },

	        IfStatement: function (stmt, flags) {
	            var result, bodyFlags, semicolonOptional, that = this;
	            withIndent(function () {
	                result = [
	                    'if' + space + '(',
	                    that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
	                    ')'
	                ];
	            });
	            semicolonOptional = flags & F_SEMICOLON_OPT;
	            bodyFlags = S_TFFF;
	            if (semicolonOptional) {
	                bodyFlags |= F_SEMICOLON_OPT;
	            }
	            if (stmt.alternate) {
	                result.push(this.maybeBlock(stmt.consequent, S_TFFF));
	                result = this.maybeBlockSuffix(stmt.consequent, result);
	                if (stmt.alternate.type === Syntax.IfStatement) {
	                    result = join(result, ['else ', this.generateStatement(stmt.alternate, bodyFlags)]);
	                } else {
	                    result = join(result, join('else', this.maybeBlock(stmt.alternate, bodyFlags)));
	                }
	            } else {
	                result.push(this.maybeBlock(stmt.consequent, bodyFlags));
	            }
	            return result;
	        },

	        ForStatement: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                result = ['for' + space + '('];
	                if (stmt.init) {
	                    if (stmt.init.type === Syntax.VariableDeclaration) {
	                        result.push(that.generateStatement(stmt.init, S_FFFF));
	                    } else {
	                        // F_ALLOW_IN becomes false.
	                        result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT));
	                        result.push(';');
	                    }
	                } else {
	                    result.push(';');
	                }

	                if (stmt.test) {
	                    result.push(space);
	                    result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT));
	                    result.push(';');
	                } else {
	                    result.push(';');
	                }

	                if (stmt.update) {
	                    result.push(space);
	                    result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT));
	                    result.push(')');
	                } else {
	                    result.push(')');
	                }
	            });

	            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
	            return result;
	        },

	        ForInStatement: function (stmt, flags) {
	            return this.generateIterationForStatement('in', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
	        },

	        ForOfStatement: function (stmt, flags) {
	            return this.generateIterationForStatement('of', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
	        },

	        LabeledStatement: function (stmt, flags) {
	            return [stmt.label.name + ':', this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
	        },

	        Program: function (stmt, flags) {
	            var result, fragment, i, iz, bodyFlags;
	            iz = stmt.body.length;
	            result = [safeConcatenation && iz > 0 ? '\n' : ''];
	            bodyFlags = S_TFTF;
	            for (i = 0; i < iz; ++i) {
	                if (!safeConcatenation && i === iz - 1) {
	                    bodyFlags |= F_SEMICOLON_OPT;
	                }
	                fragment = addIndent(this.generateStatement(stmt.body[i], bodyFlags));
	                result.push(fragment);
	                if (i + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    result.push(newline);
	                }
	            }
	            return result;
	        },

	        FunctionDeclaration: function (stmt, flags) {
	            var isGenerator = stmt.generator && !extra.moz.starlessGenerator;
	            return [
	                (isGenerator ? 'function*' : 'function'),
	                (isGenerator ? space : noEmptySpace()),
	                generateIdentifier(stmt.id),
	                this.generateFunctionBody(stmt)
	            ];
	        },

	        ReturnStatement: function (stmt, flags) {
	            if (stmt.argument) {
	                return [join(
	                    'return',
	                    this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
	                ), this.semicolon(flags)];
	            }
	            return ['return' + this.semicolon(flags)];
	        },

	        WhileStatement: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                result = [
	                    'while' + space + '(',
	                    that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
	                    ')'
	                ];
	            });
	            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
	            return result;
	        },

	        WithStatement: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                result = [
	                    'with' + space + '(',
	                    that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
	                    ')'
	                ];
	            });
	            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
	            return result;
	        }

	    };

	    merge(CodeGenerator.prototype, CodeGenerator.Statement);

	    // Expressions.

	    CodeGenerator.Expression = {

	        SequenceExpression: function (expr, precedence, flags) {
	            var result, i, iz;
	            if (Precedence.Sequence < precedence) {
	                flags |= F_ALLOW_IN;
	            }
	            result = [];
	            for (i = 0, iz = expr.expressions.length; i < iz; ++i) {
	                result.push(this.generateExpression(expr.expressions[i], Precedence.Assignment, flags));
	                if (i + 1 < iz) {
	                    result.push(',' + space);
	                }
	            }
	            return parenthesize(result, Precedence.Sequence, precedence);
	        },

	        AssignmentExpression: function (expr, precedence, flags) {
	            return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
	        },

	        ArrowFunctionExpression: function (expr, precedence, flags) {
	            return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
	        },

	        ConditionalExpression: function (expr, precedence, flags) {
	            if (Precedence.Conditional < precedence) {
	                flags |= F_ALLOW_IN;
	            }
	            return parenthesize(
	                [
	                    this.generateExpression(expr.test, Precedence.LogicalOR, flags),
	                    space + '?' + space,
	                    this.generateExpression(expr.consequent, Precedence.Assignment, flags),
	                    space + ':' + space,
	                    this.generateExpression(expr.alternate, Precedence.Assignment, flags)
	                ],
	                Precedence.Conditional,
	                precedence
	            );
	        },

	        LogicalExpression: function (expr, precedence, flags) {
	            return this.BinaryExpression(expr, precedence, flags);
	        },

	        BinaryExpression: function (expr, precedence, flags) {
	            var result, currentPrecedence, fragment, leftSource;
	            currentPrecedence = BinaryPrecedence[expr.operator];

	            if (currentPrecedence < precedence) {
	                flags |= F_ALLOW_IN;
	            }

	            fragment = this.generateExpression(expr.left, currentPrecedence, flags);

	            leftSource = fragment.toString();

	            if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPart(expr.operator.charCodeAt(0))) {
	                result = [fragment, noEmptySpace(), expr.operator];
	            } else {
	                result = join(fragment, expr.operator);
	            }

	            fragment = this.generateExpression(expr.right, currentPrecedence + 1, flags);

	            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
	            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
	                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
	                result.push(noEmptySpace());
	                result.push(fragment);
	            } else {
	                result = join(result, fragment);
	            }

	            if (expr.operator === 'in' && !(flags & F_ALLOW_IN)) {
	                return ['(', result, ')'];
	            }
	            return parenthesize(result, currentPrecedence, precedence);
	        },

	        CallExpression: function (expr, precedence, flags) {
	            var result, i, iz;
	            // F_ALLOW_UNPARATH_NEW becomes false.
	            result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)];
	            result.push('(');
	            for (i = 0, iz = expr['arguments'].length; i < iz; ++i) {
	                result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT | F_XJS_NOPAREN));
	                if (i + 1 < iz) {
	                    result.push(',' + space);
	                }
	            }
	            result.push(')');

	            if (!(flags & F_ALLOW_CALL)) {
	                return ['(', result, ')'];
	            }
	            return parenthesize(result, Precedence.Call, precedence);
	        },

	        NewExpression: function (expr, precedence, flags) {
	            var result, length, i, iz, itemFlags;
	            length = expr['arguments'].length;

	            // F_ALLOW_CALL becomes false.
	            // F_ALLOW_UNPARATH_NEW may become false.
	            itemFlags = (flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0) ? E_TFT : E_TFF;

	            result = join(
	                'new',
	                this.generateExpression(expr.callee, Precedence.New, itemFlags)
	            );

	            if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
	                result.push('(');
	                for (i = 0, iz = length; i < iz; ++i) {
	                    result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
	                    if (i + 1 < iz) {
	                        result.push(',' + space);
	                    }
	                }
	                result.push(')');
	            }

	            return parenthesize(result, Precedence.New, precedence);
	        },

	        MemberExpression: function (expr, precedence, flags) {
	            var result, fragment;

	            // F_ALLOW_UNPARATH_NEW becomes false.
	            result = [this.generateExpression(expr.object, Precedence.Call, (flags & F_ALLOW_CALL) ? E_TTF : E_TFF)];

	            if (expr.computed) {
	                result.push('[');
	                result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
	                result.push(']');
	            } else {
	                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
	                    fragment = toSourceNodeWhenNeeded(result).toString();
	                    // When the following conditions are all true,
	                    //   1. No floating point
	                    //   2. Don't have exponents
	                    //   3. The last character is a decimal digit
	                    //   4. Not hexadecimal OR octal number literal
	                    // we should add a floating point.
	                    if (
	                            fragment.indexOf('.') < 0 &&
	                            !/[eExX]/.test(fragment) &&
	                            esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
	                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
	                            ) {
	                        result.push('.');
	                    }
	                }
	                result.push('.');
	                result.push(generateIdentifier(expr.property));
	            }

	            return parenthesize(result, Precedence.Member, precedence);
	        },

	        UnaryExpression: function (expr, precedence, flags) {
	            var result, fragment, rightCharCode, leftSource, leftCharCode;
	            fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT);

	            if (space === '') {
	                result = join(expr.operator, fragment);
	            } else {
	                result = [expr.operator];
	                if (expr.operator.length > 2) {
	                    // delete, void, typeof
	                    // get `typeof []`, not `typeof[]`
	                    result = join(result, fragment);
	                } else {
	                    // Prevent inserting spaces between operator and argument if it is unnecessary
	                    // like, `!cond`
	                    leftSource = toSourceNodeWhenNeeded(result).toString();
	                    leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
	                    rightCharCode = fragment.toString().charCodeAt(0);

	                    if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
	                            (esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode))) {
	                        result.push(noEmptySpace());
	                        result.push(fragment);
	                    } else {
	                        result.push(fragment);
	                    }
	                }
	            }
	            return parenthesize(result, Precedence.Unary, precedence);
	        },

	        YieldExpression: function (expr, precedence, flags) {
	            var result;
	            if (expr.delegate) {
	                result = 'yield*';
	            } else {
	                result = 'yield';
	            }
	            if (expr.argument) {
	                result = join(
	                    result,
	                    this.generateExpression(expr.argument, Precedence.Yield, E_TTT)
	                );
	            }
	            return parenthesize(result, Precedence.Yield, precedence);
	        },

	        UpdateExpression: function (expr, precedence, flags) {
	            if (expr.prefix) {
	                return parenthesize(
	                    [
	                        expr.operator,
	                        this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
	                    ],
	                    Precedence.Unary,
	                    precedence
	                );
	            }
	            return parenthesize(
	                [
	                    this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
	                    expr.operator
	                ],
	                Precedence.Postfix,
	                precedence
	            );
	        },

	        FunctionExpression: function (expr, precedence, flags) {
	            var result, isGenerator;
	            isGenerator = expr.generator && !extra.moz.starlessGenerator;
	            result = isGenerator ? 'function*' : 'function';

	            if (expr.id) {
	                return [result, (isGenerator) ? space : noEmptySpace(), generateIdentifier(expr.id), this.generateFunctionBody(expr)];
	            }
	            return [result + space, this.generateFunctionBody(expr)];
	        },

	        ExportBatchSpecifier: function (expr, precedence, flags) {
	            return '*';
	        },

	        ArrayPattern: function (expr, precedence, flags) {
	            return this.ArrayExpression(expr, precedence, flags);
	        },

	        ArrayExpression: function (expr, precedence, flags) {
	            var result, multiline, that = this;
	            if (!expr.elements.length) {
	                return '[]';
	            }
	            multiline = expr.elements.length > 1;
	            result = ['[', multiline ? newline : ''];
	            withIndent(function (indent) {
	                var i, iz;
	                for (i = 0, iz = expr.elements.length; i < iz; ++i) {
	                    if (!expr.elements[i]) {
	                        if (multiline) {
	                            result.push(indent);
	                        }
	                        if (i + 1 === iz) {
	                            result.push(',');
	                        }
	                    } else {
	                        result.push(multiline ? indent : '');
	                        result.push(that.generateExpression(expr.elements[i], Precedence.Assignment, E_TTT | F_XJS_NOINDENT | F_XJS_NOPAREN));
	                    }
	                    if (i + 1 < iz) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });
	            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '');
	            result.push(']');
	            return result;
	        },

	        ClassExpression: function (expr, precedence, flags) {
	            var result, fragment;
	            result = ['class'];
	            if (expr.id) {
	                result = join(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT));
	            }
	            if (expr.superClass) {
	                fragment = join('extends', this.generateExpression(expr.superClass, Precedence.Assignment, E_TTT));
	                result = join(result, fragment);
	            }
	            result.push(space);
	            result.push(this.generateStatement(expr.body, S_TFFT));
	            return result;
	        },

	        MethodDefinition: function (expr, precedence, flags) {
	            var result, fragment;
	            if (expr['static']) {
	                result = ['static' + space];
	            } else {
	                result = [];
	            }

	            if (expr.kind === 'get' || expr.kind === 'set') {
	                result = join(result, [
	                    join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
	                    this.generateFunctionBody(expr.value)
	                ]);
	            } else {
	                fragment = [
	                    this.generatePropertyKey(expr.key, expr.computed),
	                    this.generateFunctionBody(expr.value)
	                ];
	                if (expr.value.generator) {
	                    result.push('*');
	                    result.push(fragment);
	                } else {
	                    result = join(result, fragment);
	                }
	            }
	            return result;
	        },

	        Property: function (expr, precedence, flags) {
	            var result;
	            if (expr.kind === 'get' || expr.kind === 'set') {
	                return [
	                    expr.kind, noEmptySpace(),
	                    this.generatePropertyKey(expr.key, expr.computed),
	                    this.generateFunctionBody(expr.value)
	                ];
	            }

	            if (expr.shorthand) {
	                return this.generatePropertyKey(expr.key, expr.computed);
	            }

	            if (expr.method) {
	                result = [];
	                if (expr.value.generator) {
	                    result.push('*');
	                }
	                result.push(this.generatePropertyKey(expr.key, expr.computed));
	                result.push(this.generateFunctionBody(expr.value));
	                return result;
	            }

	            return [
	                this.generatePropertyKey(expr.key, expr.computed),
	                ':' + space,
	                this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
	            ];
	        },

	        ObjectExpression: function (expr, precedence, flags) {
	            var multiline, result, fragment, that = this;

	            if (!expr.properties.length) {
	                return '{}';
	            }
	            multiline = expr.properties.length > 1;

	            withIndent(function () {
	                fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
	            });

	            if (!multiline) {
	                // issues 4
	                // Do not transform from
	                //   dejavu.Class.declare({
	                //       method2: function () {}
	                //   });
	                // to
	                //   dejavu.Class.declare({method2: function () {
	                //       }});
	                if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    return [ '{', space, fragment, space, '}' ];
	                }
	            }

	            withIndent(function (indent) {
	                var i, iz;
	                result = [ '{', newline, indent, fragment ];

	                if (multiline) {
	                    result.push(',' + newline);
	                    for (i = 1, iz = expr.properties.length; i < iz; ++i) {
	                        result.push(indent);
	                        result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
	                        if (i + 1 < iz) {
	                            result.push(',' + newline);
	                        }
	                    }
	                }
	            });

	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(base);
	            result.push('}');
	            return result;
	        },

	        ObjectPattern: function (expr, precedence, flags) {
	            var result, i, iz, multiline, property, that = this;
	            if (!expr.properties.length) {
	                return '{}';
	            }

	            multiline = false;
	            if (expr.properties.length === 1) {
	                property = expr.properties[0];
	                if (property.value.type !== Syntax.Identifier) {
	                    multiline = true;
	                }
	            } else {
	                for (i = 0, iz = expr.properties.length; i < iz; ++i) {
	                    property = expr.properties[i];
	                    if (!property.shorthand) {
	                        multiline = true;
	                        break;
	                    }
	                }
	            }
	            result = ['{', multiline ? newline : '' ];

	            withIndent(function (indent) {
	                var i, iz;
	                for (i = 0, iz = expr.properties.length; i < iz; ++i) {
	                    result.push(multiline ? indent : '');
	                    result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
	                    if (i + 1 < iz) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });

	            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '');
	            result.push('}');
	            return result;
	        },

	        ThisExpression: function (expr, precedence, flags) {
	            return 'this';
	        },

	        Identifier: function (expr, precedence, flags) {
	            return generateIdentifier(expr);
	        },

	        ImportDefaultSpecifier: function (expr, precedence, flags) {
	            return generateIdentifier(expr.id);
	        },

	        ImportNamespaceSpecifier: function (expr, precedence, flags) {
	            var result = ['*'];
	            if (expr.id) {
	                result.push(space + 'as' + noEmptySpace() + generateIdentifier(expr.id));
	            }
	            return result;
	        },

	        ImportSpecifier: function (expr, precedence, flags) {
	            return this.ExportSpecifier(expr, precedence, flags);
	        },

	        ExportSpecifier: function (expr, precedence, flags) {
	            var result = [ expr.id.name ];
	            if (expr.name) {
	                result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(expr.name));
	            }
	            return result;
	        },

	        Literal: function (expr, precedence, flags) {
	            var raw;
	            if (expr.hasOwnProperty('raw') && parse && extra.raw) {
	                try {
	                    raw = parse(expr.raw).body[0].expression;
	                    if (raw.type === Syntax.Literal) {
	                        if (raw.value === expr.value) {
	                            return expr.raw;
	                        }
	                    }
	                } catch (e) {
	                    // not use raw property
	                }
	            }

	            if (expr.value === null) {
	                return 'null';
	            }

	            if (typeof expr.value === 'string') {
	                return escapeString(expr.value);
	            }

	            if (typeof expr.value === 'number') {
	                return generateNumber(expr.value);
	            }

	            if (typeof expr.value === 'boolean') {
	                return expr.value ? 'true' : 'false';
	            }

	            return generateRegExp(expr.value);
	        },

	        GeneratorExpression: function (expr, precedence, flags) {
	            return this.ComprehensionExpression(expr, precedence, flags);
	        },

	        ComprehensionExpression: function (expr, precedence, flags) {
	            // GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
	            // Due to https://bugzilla.mozilla.org/show_bug.cgi?id=883468 position of expr.body can differ in Spidermonkey and ES6

	            var result, i, iz, fragment, that = this;
	            result = (expr.type === Syntax.GeneratorExpression) ? ['('] : ['['];

	            if (extra.moz.comprehensionExpressionStartsWithAssignment) {
	                fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
	                result.push(fragment);
	            }

	            if (expr.blocks) {
	                withIndent(function () {
	                    for (i = 0, iz = expr.blocks.length; i < iz; ++i) {
	                        fragment = that.generateExpression(expr.blocks[i], Precedence.Sequence, E_TTT);
	                        if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
	                            result = join(result, fragment);
	                        } else {
	                            result.push(fragment);
	                        }
	                    }
	                });
	            }

	            if (expr.filter) {
	                result = join(result, 'if' + space);
	                fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT);
	                result = join(result, [ '(', fragment, ')' ]);
	            }

	            if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
	                fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);

	                result = join(result, fragment);
	            }

	            result.push((expr.type === Syntax.GeneratorExpression) ? ')' : ']');
	            return result;
	        },

	        ComprehensionBlock: function (expr, precedence, flags) {
	            var fragment;
	            if (expr.left.type === Syntax.VariableDeclaration) {
	                fragment = [
	                    expr.left.kind, noEmptySpace(),
	                    this.generateStatement(expr.left.declarations[0], S_FFFF)
	                ];
	            } else {
	                fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT);
	            }

	            fragment = join(fragment, expr.of ? 'of' : 'in');
	            fragment = join(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT));

	            return [ 'for' + space + '(', fragment, ')' ];
	        },

	        SpreadElement: function (expr, precedence, flags) {
	            return [
	                '...',
	                this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
	            ];
	        },

	        TaggedTemplateExpression: function (expr, precedence, flags) {
	            var itemFlags = E_TTF;
	            if (!(flags & F_ALLOW_CALL)) {
	                itemFlags = E_TFF;
	            }
	            var result = [
	                this.generateExpression(expr.tag, Precedence.Call, itemFlags),
	                this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
	            ];
	            return parenthesize(result, Precedence.TaggedTemplate, precedence);
	        },

	        TemplateElement: function (expr, precedence, flags) {
	            // Don't use "cooked". Since tagged template can use raw template
	            // representation. So if we do so, it breaks the script semantics.
	            return expr.value.raw;
	        },

	        TemplateLiteral: function (expr, precedence, flags) {
	            var result, i, iz;
	            result = [ '`' ];
	            for (i = 0, iz = expr.quasis.length; i < iz; ++i) {
	                result.push(this.generateExpression(expr.quasis[i], Precedence.Primary, E_TTT));
	                if (i + 1 < iz) {
	                    result.push('${' + space);
	                    result.push(this.generateExpression(expr.expressions[i], Precedence.Sequence, E_TTT));
	                    result.push(space + '}');
	                }
	            }
	            result.push('`');
	            return result;
	        },

	        ModuleSpecifier: function (expr, precedence, flags) {
	            return this.Literal(expr, precedence, flags);
	        },

	        XJSAttribute: function (expr, precedence, flags) {
	            var result = [];

	            var fragment = this.generateExpression(expr.name, Precedence.Sequence, {
	                allowIn: true,
	                allowCall: true
	            });
	            result.push(fragment);

	            if (expr.value) {
	                result.push('=');

	                if (expr.value.type === Syntax.Literal) {
	                    fragment = xjsEscapeAttr(expr.value.value, expr.value.raw);

	                } else {
	                    fragment = this.generateExpression(expr.value, Precedence.Sequence, {
	                        allowIn: true,
	                        allowCall: true
	                    });
	                }
	                result.push(fragment);
	            }
	            return result;
	        },

	        XJSClosingElement: function (expr, precedence, flags) {
	            return [
	                '</',
	                this.generateExpression(expr.name, Precedence.Sequence, 0),
	                '>'
	            ];
	        },

	        XJSElement: function (expr, precedence, flags) {
	            var result = [], that = this;

	            if (!(flags & F_XJS_NOINDENT)) {
	                base += indent;
	            }

	            var fragment = this.generateExpression(expr.openingElement, Precedence.XJSElement, {
	                allowIn: true,
	                allowCall: true
	            });
	            result.push(fragment);

	            var xjsFragments = [];
	            var multiline = !expr.openingElement.selfClosing &&
	                hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString());

	            var i, len;
	            withIndent(function(indent) {
	                for (i = 0, len = expr.children.length; i < len; ++i) {
	                    if (expr.children[i].type === Syntax.Literal) {
	                        fragment = expr.children[i].raw.trim();
	                        if (fragment) {
	                            xjsFragments.push(fragment);
	                        }
	                        continue;
	                    }

	                    fragment = that.generateExpression(expr.children[i], Precedence.XJSElement, E_TTF | F_XJS_NOINDENT);

	                    xjsFragments.push(fragment);
	                    multiline = multiline || xjsHasNode(expr.children[i]);
	                }

	                multiline = multiline || xjsFragments.length > 1 ||
	                    (xjsFragments.length &&
	                        hasLineTerminator(toSourceNodeWhenNeeded(xjsFragments[0]).toString()));

	                for (i = 0, len = xjsFragments.length; i < len; ++i) {
	                    if (multiline) {
	                        result.push(newline + indent);
	                    }
	                    result.push(xjsFragments[i]);
	                }
	            });

	            if (multiline) {
	                result.push(newline + base);
	            }

	            if (expr.closingElement) {
	                fragment = that.generateExpression(expr.closingElement, Precedence.XJSElement, 0);
	                result.push(fragment);
	            }

	            if (!(flags & F_XJS_NOINDENT)) {
	                base = base.slice(0, base.length - indent.length);
	                if (hasLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    if (flags & F_XJS_NOPAREN) {
	                        result = [
	                            newline + base + indent,
	                            result,
	                            newline + base
	                        ];
	                    } else {
	                        result = [
	                            '(' + newline + base + indent,
	                            result,
	                            newline + base + ')'
	                        ];
	                    }
	                }
	            }
	            return result;
	        },

	        XJSExpressionContainer: function (expr, precedence, flags) {
	            return [
	                '{',
	                this.generateExpression(expr.expression, Precedence.Sequence, E_TTF),
	                '}'
	            ];
	        },

	        XJSIdentifier: function (expr, precedence, flags) {
	            return expr.name;
	        },

	        XJSMemberExpression: function (expr, precedence, flags) {
	            return [
	                this.generateExpression(expr.object, Precedence.Sequence, E_TFF),
	                '.',
	                this.generateExpression(expr.property, Precedence.Sequence, 0)
	            ];
	        },

	        XJSNamespacedName: function (expr, precedence, flags) {
	            return [
	                this.generateExpression(expr.namespace, Precedence.Sequence, 0),
	                '.',
	                this.generateExpression(expr.name, Precedence.Sequence, 0)
	            ];
	        },

	        XJSOpeningElement: function (expr, precedence, flags) {
	            var result = ['<'], that = this;

	            var fragment = this.generateExpression(expr.name, Precedence.Sequence, 0);
	            result.push(fragment);

	            var xjsFragments = [];
	            for (var i = 0, len = expr.attributes.length; i < len; ++i) {
	                fragment = that.generateExpression(expr.attributes[i], Precedence.Sequence, E_TTF);
	                xjsFragments.push({
	                    expr: expr.attributes[i],
	                    name: expr.attributes[i].name.name,
	                    fragment: fragment,
	                    multiline: hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())
	                });
	                if (expr.attributes.length > 3 && expr.attributes[i].value &&
	                    expr.attributes[i].value.type !== Syntax.Literal) {
	                    xjsFragments[xjsFragments.length - 1].multiline = true;
	                }
	            }

	            xjsFragments.sort(function(a, b) {
	                if (!a.multiline && !b.multiline) {
	                    return a.name > b.name ? 1 : -1;
	                }
	                if (!a.multiline) {
	                    return -1;
	                }
	                if (!b.multiline) {
	                    return 1;
	                }
	                return a.name > b.name ? 1 : -1;
	            });

	            withIndent(function(indent) {
	                for (var i = 0, len = xjsFragments.length; i < len; ++i) {
	                    if ((i > 0 && i % 3 === 0) ||
	                        xjsFragments[i].multiline) {
	                        result.push(newline + indent);
	                    } else {
	                        result.push(' ');
	                    }

	                    // generate expression again
	                    result.push(that.generateExpression(xjsFragments[i].expr, Precedence.Sequence, E_TTF));
	                }
	            });

	            result.push(expr.selfClosing ? '/>' : '>');
	            return result;
	        }
	    };

	    merge(CodeGenerator.prototype, CodeGenerator.Expression);

	    CodeGenerator.prototype.generateExpression = function (expr, precedence, flags) {
	        var result, type;

	        type = expr.type || Syntax.Property;

	        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
	            return generateVerbatim(expr, precedence);
	        }

	        result = this[type](expr, precedence, flags);


	        if (extra.comment) {
	            result = addComments(expr,result);
	        }
	        return toSourceNodeWhenNeeded(result, expr);
	    };

	    CodeGenerator.prototype.generateStatement = function (stmt, flags) {
	        var result,
	            fragment;

	        result = this[stmt.type](stmt, flags);

	        // Attach comments

	        if (extra.comment) {
	            result = addComments(stmt, result);
	        }

	        fragment = toSourceNodeWhenNeeded(result).toString();
	        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
	            result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
	        }

	        return toSourceNodeWhenNeeded(result, stmt);
	    };

	    function generateInternal(node) {
	        var codegen;

	        codegen = new CodeGenerator();
	        if (isStatement(node)) {
	            return codegen.generateStatement(node, S_TFFF);
	        }

	        if (isExpression(node)) {
	            return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
	        }

	        throw new Error('Unknown node type: ' + node.type);
	    }

	    function generate(node, options) {
	        var defaultOptions = getDefaultOptions(), result, pair;

	        if (options != null) {
	            // Obsolete options
	            //
	            //   `options.indent`
	            //   `options.base`
	            //
	            // Instead of them, we can use `option.format.indent`.
	            if (typeof options.indent === 'string') {
	                defaultOptions.format.indent.style = options.indent;
	            }
	            if (typeof options.base === 'number') {
	                defaultOptions.format.indent.base = options.base;
	            }
	            options = updateDeeply(defaultOptions, options);
	            indent = options.format.indent.style;
	            if (typeof options.base === 'string') {
	                base = options.base;
	            } else {
	                base = stringRepeat(indent, options.format.indent.base);
	            }
	        } else {
	            options = defaultOptions;
	            indent = options.format.indent.style;
	            base = stringRepeat(indent, options.format.indent.base);
	        }
	        json = options.format.json;
	        renumber = options.format.renumber;
	        hexadecimal = json ? false : options.format.hexadecimal;
	        quotes = json ? 'double' : options.format.quotes;
	        escapeless = options.format.escapeless;
	        newline = options.format.newline;
	        space = options.format.space;
	        if (options.format.compact) {
	            newline = space = indent = base = '';
	        }
	        parentheses = options.format.parentheses;
	        semicolons = options.format.semicolons;
	        safeConcatenation = options.format.safeConcatenation;
	        directive = options.directive;
	        parse = json ? null : options.parse;
	        sourceMap = options.sourceMap;
	        extra = options;

	        if (sourceMap) {
	            if (!exports.browser) {
	                // We assume environment is node.js
	                // And prevent from including source-map by browserify
	                SourceNode = __webpack_require__(7).SourceNode;
	            } else {
	                SourceNode = global.sourceMap.SourceNode;
	            }
	        }

	        result = generateInternal(node);

	        if (!sourceMap) {
	            pair = {code: result.toString(), map: null};
	            return options.sourceMapWithCode ? pair : pair.code;
	        }


	        pair = result.toStringWithSourceMap({
	            file: options.file,
	            sourceRoot: options.sourceMapRoot
	        });

	        if (options.sourceContent) {
	            pair.map.setSourceContent(options.sourceMap,
	                                      options.sourceContent);
	        }

	        if (options.sourceMapWithCode) {
	            return pair;
	        }

	        return pair.map.toString();
	    }

	    // xjs
	    function xjsEscapeAttr(s, raw) {
	        if (s.indexOf('"') >= 0 || s.indexOf('\'') >= 0) {
	            return raw;
	        }
	        return quotes === 'double' ? '"' + s + '"' : '\'' + s + '\'';
	    }

	    function xjsHasNode(expr) {
	        if (expr.type !== Syntax.XJSElement) {
	            return false;
	        }

	        for (var i = 0, len = expr.children.length; i < len; ++i) {
	            if (expr.children[i].type === Syntax.XJSElement) {
	                return true;
	            }
	        }
	        return false;
	    }
	    // end xjs

	    FORMAT_MINIFY = {
	        indent: {
	            style: '',
	            base: 0
	        },
	        renumber: true,
	        hexadecimal: true,
	        quotes: 'auto',
	        escapeless: true,
	        compact: true,
	        parentheses: false,
	        semicolons: false
	    };

	    FORMAT_DEFAULTS = getDefaultOptions().format;

	    exports.version = __webpack_require__(6).version;
	    exports.generate = generate;
	    exports.attachComments = estraverse.attachComments;
	    exports.Precedence = updateDeeply({}, Precedence);
	    exports.browser = false;
	    exports.FORMAT_MINIFY = FORMAT_MINIFY;
	    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // Rhino, and plain browser loading.

	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.esprima = {}));
	    }
	}(this, function (exports) {
	    'use strict';

	    var Token,
	        TokenName,
	        FnExprTokens,
	        Syntax,
	        PropertyKind,
	        Messages,
	        Regex,
	        SyntaxTreeDelegate,
	        XHTMLEntities,
	        ClassPropertyType,
	        source,
	        strict,
	        index,
	        lineNumber,
	        lineStart,
	        length,
	        delegate,
	        lookahead,
	        state,
	        extra;

	    Token = {
	        BooleanLiteral: 1,
	        EOF: 2,
	        Identifier: 3,
	        Keyword: 4,
	        NullLiteral: 5,
	        NumericLiteral: 6,
	        Punctuator: 7,
	        StringLiteral: 8,
	        RegularExpression: 9,
	        Template: 10,
	        JSXIdentifier: 11,
	        JSXText: 12
	    };

	    TokenName = {};
	    TokenName[Token.BooleanLiteral] = 'Boolean';
	    TokenName[Token.EOF] = '<end>';
	    TokenName[Token.Identifier] = 'Identifier';
	    TokenName[Token.Keyword] = 'Keyword';
	    TokenName[Token.NullLiteral] = 'Null';
	    TokenName[Token.NumericLiteral] = 'Numeric';
	    TokenName[Token.Punctuator] = 'Punctuator';
	    TokenName[Token.StringLiteral] = 'String';
	    TokenName[Token.JSXIdentifier] = 'JSXIdentifier';
	    TokenName[Token.JSXText] = 'JSXText';
	    TokenName[Token.RegularExpression] = 'RegularExpression';
	    TokenName[Token.Template] = 'Template';

	    // A function following one of those tokens is an expression.
	    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	                    'return', 'case', 'delete', 'throw', 'void',
	                    // assignment operators
	                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
	                    '&=', '|=', '^=', ',',
	                    // binary/unary operators
	                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	                    '<=', '<', '>', '!=', '!=='];

	    Syntax = {
	        AnyTypeAnnotation: 'AnyTypeAnnotation',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrayTypeAnnotation: 'ArrayTypeAnnotation',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AssignmentExpression: 'AssignmentExpression',
	        BinaryExpression: 'BinaryExpression',
	        BlockStatement: 'BlockStatement',
	        BooleanTypeAnnotation: 'BooleanTypeAnnotation',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ClassImplements: 'ClassImplements',
	        ClassProperty: 'ClassProperty',
	        ComprehensionBlock: 'ComprehensionBlock',
	        ComprehensionExpression: 'ComprehensionExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DeclareClass: 'DeclareClass',
	        DeclareFunction: 'DeclareFunction',
	        DeclareModule: 'DeclareModule',
	        DeclareVariable: 'DeclareVariable',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportDeclaration: 'ExportDeclaration',
	        ExportBatchSpecifier: 'ExportBatchSpecifier',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        ForStatement: 'ForStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        FunctionTypeAnnotation: 'FunctionTypeAnnotation',
	        FunctionTypeParam: 'FunctionTypeParam',
	        GenericTypeAnnotation: 'GenericTypeAnnotation',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        InterfaceDeclaration: 'InterfaceDeclaration',
	        InterfaceExtends: 'InterfaceExtends',
	        IntersectionTypeAnnotation: 'IntersectionTypeAnnotation',
	        LabeledStatement: 'LabeledStatement',
	        Literal: 'Literal',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        NewExpression: 'NewExpression',
	        NullableTypeAnnotation: 'NullableTypeAnnotation',
	        NumberTypeAnnotation: 'NumberTypeAnnotation',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        ObjectTypeAnnotation: 'ObjectTypeAnnotation',
	        ObjectTypeCallProperty: 'ObjectTypeCallProperty',
	        ObjectTypeIndexer: 'ObjectTypeIndexer',
	        ObjectTypeProperty: 'ObjectTypeProperty',
	        Program: 'Program',
	        Property: 'Property',
	        QualifiedTypeIdentifier: 'QualifiedTypeIdentifier',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        SpreadProperty: 'SpreadProperty',
	        StringLiteralTypeAnnotation: 'StringLiteralTypeAnnotation',
	        StringTypeAnnotation: 'StringTypeAnnotation',
	        SwitchCase: 'SwitchCase',
	        SwitchStatement: 'SwitchStatement',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TupleTypeAnnotation: 'TupleTypeAnnotation',
	        TryStatement: 'TryStatement',
	        TypeAlias: 'TypeAlias',
	        TypeAnnotation: 'TypeAnnotation',
	        TypeCastExpression: 'TypeCastExpression',
	        TypeofTypeAnnotation: 'TypeofTypeAnnotation',
	        TypeParameterDeclaration: 'TypeParameterDeclaration',
	        TypeParameterInstantiation: 'TypeParameterInstantiation',
	        UnaryExpression: 'UnaryExpression',
	        UnionTypeAnnotation: 'UnionTypeAnnotation',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        VoidTypeAnnotation: 'VoidTypeAnnotation',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        JSXIdentifier: 'JSXIdentifier',
	        JSXNamespacedName: 'JSXNamespacedName',
	        JSXMemberExpression: 'JSXMemberExpression',
	        JSXEmptyExpression: 'JSXEmptyExpression',
	        JSXExpressionContainer: 'JSXExpressionContainer',
	        JSXElement: 'JSXElement',
	        JSXClosingElement: 'JSXClosingElement',
	        JSXOpeningElement: 'JSXOpeningElement',
	        JSXAttribute: 'JSXAttribute',
	        JSXSpreadAttribute: 'JSXSpreadAttribute',
	        JSXText: 'JSXText',
	        YieldExpression: 'YieldExpression',
	        AwaitExpression: 'AwaitExpression'
	    };

	    PropertyKind = {
	        Data: 1,
	        Get: 2,
	        Set: 4
	    };

	    ClassPropertyType = {
	        'static': 'static',
	        prototype: 'prototype'
	    };

	    // Error messages should be identical to V8.
	    Messages = {
	        UnexpectedToken: 'Unexpected token %0',
	        UnexpectedNumber: 'Unexpected number',
	        UnexpectedString: 'Unexpected string',
	        UnexpectedIdentifier: 'Unexpected identifier',
	        UnexpectedReserved: 'Unexpected reserved word',
	        UnexpectedTemplate: 'Unexpected quasi %0',
	        UnexpectedEOS: 'Unexpected end of input',
	        NewlineAfterThrow: 'Illegal newline after throw',
	        InvalidRegExp: 'Invalid regular expression',
	        UnterminatedRegExp: 'Invalid regular expression: missing /',
	        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
	        InvalidLHSInFormalsList: 'Invalid left-hand side in formals list',
	        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
	        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	        NoCatchOrFinally: 'Missing catch or finally after try',
	        UnknownLabel: 'Undefined label \'%0\'',
	        Redeclaration: '%0 \'%1\' has already been declared',
	        IllegalContinue: 'Illegal continue statement',
	        IllegalBreak: 'Illegal break statement',
	        IllegalDuplicateClassProperty: 'Illegal duplicate property in class definition',
	        IllegalClassConstructorProperty: 'Illegal constructor property in class definition',
	        IllegalReturn: 'Illegal return statement',
	        IllegalSpread: 'Illegal spread element',
	        StrictModeWith: 'Strict mode code may not include a with statement',
	        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
	        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
	        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
	        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	        ParameterAfterRestParameter: 'Rest parameter must be final parameter of an argument list',
	        DefaultRestParameter: 'Rest parameter can not have a default value',
	        ElementAfterSpreadElement: 'Spread must be the final element of an element list',
	        PropertyAfterSpreadProperty: 'A rest property must be the final property of an object literal',
	        ObjectPatternAsRestParameter: 'Invalid rest parameter',
	        ObjectPatternAsSpread: 'Invalid spread argument',
	        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
	        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
	        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
	        StrictDuplicateProperty: 'Duplicate data property in object literal not allowed in strict mode',
	        AccessorDataProperty: 'Object literal may not have data and accessor property with the same name',
	        AccessorGetSet: 'Object literal may not have multiple get/set accessors with the same name',
	        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
	        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictReservedWord: 'Use of future reserved word in strict mode',
	        MissingFromClause: 'Missing from clause',
	        NoAsAfterImportNamespace: 'Missing as after import *',
	        InvalidModuleSpecifier: 'Invalid module specifier',
	        IllegalImportDeclaration: 'Illegal import declaration',
	        IllegalExportDeclaration: 'Illegal export declaration',
	        NoUninitializedConst: 'Const must be initialized',
	        ComprehensionRequiresBlock: 'Comprehension must have at least one block',
	        ComprehensionError: 'Comprehension Error',
	        EachNotAllowed: 'Each is not supported',
	        InvalidJSXAttributeValue: 'JSX value should be either an expression or a quoted JSX text',
	        ExpectedJSXClosingTag: 'Expected corresponding JSX closing tag for %0',
	        AdjacentJSXElements: 'Adjacent JSX elements must be wrapped in an enclosing tag',
	        ConfusedAboutFunctionType: 'Unexpected token =>. It looks like ' +
	            'you are trying to write a function type, but you ended up ' +
	            'writing a grouped type followed by an =>, which is a syntax ' +
	            'error. Remember, function type parameters are named so function ' +
	            'types look like (name1: type1, name2: type2) => returnType. You ' +
	            'probably wrote (type1) => returnType'
	    };

	    // See also tools/generate-unicode-regex.py.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
	        NonAsciiIdentifierPart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0\u08a2-\u08ac\u08e4-\u08fe\u0900-\u0963\u0966-\u096f\u0971-\u0977\u0979-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1d00-\u1de6\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua697\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a\uaa7b\uaa80-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
	        LeadingZeros: new RegExp('^0+(?!$)')
	    };

	    // Ensure the condition is true, otherwise throw an error.
	    // This is only to have a better contract semantic, i.e. another safety net
	    // to catch a logic error. The condition shall be fulfilled in normal case.
	    // Do NOT use this to enforce a certain condition on any user input.

	    function assert(condition, message) {
	        /* istanbul ignore if */
	        if (!condition) {
	            throw new Error('ASSERT: ' + message);
	        }
	    }

	    function StringMap() {
	        this.$data = {};
	    }

	    StringMap.prototype.get = function (key) {
	        key = '$' + key;
	        return this.$data[key];
	    };

	    StringMap.prototype.set = function (key, value) {
	        key = '$' + key;
	        this.$data[key] = value;
	        return this;
	    };

	    StringMap.prototype.has = function (key) {
	        key = '$' + key;
	        return Object.prototype.hasOwnProperty.call(this.$data, key);
	    };

	    StringMap.prototype.delete = function (key) {
	        key = '$' + key;
	        return delete this.$data[key];
	    };

	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }

	    function isHexDigit(ch) {
	        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	    }

	    function isOctalDigit(ch) {
	        return '01234567'.indexOf(ch) >= 0;
	    }


	    // 7.2 White Space

	    function isWhiteSpace(ch) {
	        return (ch === 32) ||  // space
	            (ch === 9) ||      // tab
	            (ch === 0xB) ||
	            (ch === 0xC) ||
	            (ch === 0xA0) ||
	            (ch >= 0x1680 && '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(String.fromCharCode(ch)) > 0);
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return (ch === 10) || (ch === 13) || (ch === 0x2028) || (ch === 0x2029);
	    }

	    // 7.6 Identifier Names and Identifiers

	    function isIdentifierStart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }

	    function isIdentifierPart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch >= 48 && ch <= 57) ||         // 0..9
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }

	    // 7.6.1.2 Future Reserved Words

	    function isFutureReservedWord(id) {
	        switch (id) {
	        case 'class':
	        case 'enum':
	        case 'export':
	        case 'extends':
	        case 'import':
	        case 'super':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isStrictModeReservedWord(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'yield':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    // 7.6.1.1 Keywords

	    function isKeyword(id) {
	        if (strict && isStrictModeReservedWord(id)) {
	            return true;
	        }

	        // 'const' is specialized as Keyword in V8.
	        // 'yield' is only treated as a keyword in strict mode.
	        // 'let' is for compatiblity with SpiderMonkey and ES.next.
	        // Some others are from future reserved words.

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') ||
	                (id === 'try') || (id === 'let');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    // 7.4 Comments

	    function addComment(type, value, start, end, loc) {
	        var comment;
	        assert(typeof start === 'number', 'Comment must have valid position');

	        // Because the way the actual token is scanned, often the comments
	        // (if any) are skipped twice during the lexical analysis.
	        // Thus, we need to skip adding a comment if the comment array already
	        // handled it.
	        if (state.lastCommentStart >= start) {
	            return;
	        }
	        state.lastCommentStart = start;

	        comment = {
	            type: type,
	            value: value
	        };
	        if (extra.range) {
	            comment.range = [start, end];
	        }
	        if (extra.loc) {
	            comment.loc = loc;
	        }
	        extra.comments.push(comment);
	        if (extra.attachComment) {
	            extra.leadingComments.push(comment);
	            extra.trailingComments.push(comment);
	        }
	    }

	    function skipSingleLineComment() {
	        var start, loc, ch, comment;

	        start = index - 2;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart - 2
	            }
	        };

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            ++index;
	            if (isLineTerminator(ch)) {
	                if (extra.comments) {
	                    comment = source.slice(start + 2, index - 1);
	                    loc.end = {
	                        line: lineNumber,
	                        column: index - lineStart - 1
	                    };
	                    addComment('Line', comment, start, index - 1, loc);
	                }
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                return;
	            }
	        }

	        if (extra.comments) {
	            comment = source.slice(start + 2, index);
	            loc.end = {
	                line: lineNumber,
	                column: index - lineStart
	            };
	            addComment('Line', comment, start, index, loc);
	        }
	    }

	    function skipMultiLineComment() {
	        var start, loc, ch, comment;

	        if (extra.comments) {
	            start = index - 2;
	            loc = {
	                start: {
	                    line: lineNumber,
	                    column: index - lineStart - 2
	                }
	            };
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (isLineTerminator(ch)) {
	                if (ch === 13 && source.charCodeAt(index + 1) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                ++index;
	                lineStart = index;
	                if (index >= length) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else if (ch === 42) {
	                // Block comment ends with '*/' (char #42, char #47).
	                if (source.charCodeAt(index + 1) === 47) {
	                    ++index;
	                    ++index;
	                    if (extra.comments) {
	                        comment = source.slice(start + 2, index - 2);
	                        loc.end = {
	                            line: lineNumber,
	                            column: index - lineStart
	                        };
	                        addComment('Block', comment, start, index, loc);
	                    }
	                    return;
	                }
	                ++index;
	            } else {
	                ++index;
	            }
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    function skipComment() {
	        var ch;

	        while (index < length) {
	            ch = source.charCodeAt(index);

	            if (isWhiteSpace(ch)) {
	                ++index;
	            } else if (isLineTerminator(ch)) {
	                ++index;
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	            } else if (ch === 47) { // 47 is '/'
	                ch = source.charCodeAt(index + 1);
	                if (ch === 47) {
	                    ++index;
	                    ++index;
	                    skipSingleLineComment();
	                } else if (ch === 42) {  // 42 is '*'
	                    ++index;
	                    ++index;
	                    skipMultiLineComment();
	                } else {
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	    }

	    function scanHexEscape(prefix) {
	        var i, len, ch, code = 0;

	        len = (prefix === 'u') ? 4 : 2;
	        for (i = 0; i < len; ++i) {
	            if (index < length && isHexDigit(source[index])) {
	                ch = source[index++];
	                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	            } else {
	                return '';
	            }
	        }
	        return String.fromCharCode(code);
	    }

	    function scanUnicodeCodePointEscape() {
	        var ch, code, cu1, cu2;

	        ch = source[index];
	        code = 0;

	        // At least, one hex digit is required.
	        if (ch === '}') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        while (index < length) {
	            ch = source[index++];
	            if (!isHexDigit(ch)) {
	                break;
	            }
	            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	        }

	        if (code > 0x10FFFF || ch !== '}') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        // UTF-16 Encoding
	        if (code <= 0xFFFF) {
	            return String.fromCharCode(code);
	        }
	        cu1 = ((code - 0x10000) >> 10) + 0xD800;
	        cu2 = ((code - 0x10000) & 1023) + 0xDC00;
	        return String.fromCharCode(cu1, cu2);
	    }

	    function getEscapedIdentifier() {
	        var ch, id;

	        ch = source.charCodeAt(index++);
	        id = String.fromCharCode(ch);

	        // '\u' (char #92, char #117) denotes an escaped character.
	        if (ch === 92) {
	            if (source.charCodeAt(index) !== 117) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            ++index;
	            ch = scanHexEscape('u');
	            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            id = ch;
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isIdentifierPart(ch)) {
	                break;
	            }
	            ++index;
	            id += String.fromCharCode(ch);

	            // '\u' (char #92, char #117) denotes an escaped character.
	            if (ch === 92) {
	                id = id.substr(0, id.length - 1);
	                if (source.charCodeAt(index) !== 117) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                ++index;
	                ch = scanHexEscape('u');
	                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                id += ch;
	            }
	        }

	        return id;
	    }

	    function getIdentifier() {
	        var start, ch;

	        start = index++;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 92) {
	                // Blackslash (char #92) marks Unicode escape sequence.
	                index = start;
	                return getEscapedIdentifier();
	            }
	            if (isIdentifierPart(ch)) {
	                ++index;
	            } else {
	                break;
	            }
	        }

	        return source.slice(start, index);
	    }

	    function scanIdentifier() {
	        var start, id, type;

	        start = index;

	        // Backslash (char #92) starts an escaped character.
	        id = (source.charCodeAt(index) === 92) ? getEscapedIdentifier() : getIdentifier();

	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = Token.Identifier;
	        } else if (isKeyword(id)) {
	            type = Token.Keyword;
	        } else if (id === 'null') {
	            type = Token.NullLiteral;
	        } else if (id === 'true' || id === 'false') {
	            type = Token.BooleanLiteral;
	        } else {
	            type = Token.Identifier;
	        }

	        return {
	            type: type,
	            value: id,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }


	    // 7.7 Punctuators

	    function scanPunctuator() {
	        var start = index,
	            code = source.charCodeAt(index),
	            code2,
	            ch1 = source[index],
	            ch2,
	            ch3,
	            ch4;

	        if (state.inJSXTag || state.inJSXChild) {
	            // Don't need to check for '{' and '}' as it's already handled
	            // correctly by default.
	            switch (code) {
	            case 60:  // <
	            case 62:  // >
	                ++index;
	                return {
	                    type: Token.Punctuator,
	                    value: String.fromCharCode(code),
	                    lineNumber: lineNumber,
	                    lineStart: lineStart,
	                    range: [start, index]
	                };
	            }
	        }

	        switch (code) {
	        // Check for most common single-character punctuators.
	        case 40:   // ( open bracket
	        case 41:   // ) close bracket
	        case 59:   // ; semicolon
	        case 44:   // , comma
	        case 91:   // [
	        case 93:   // ]
	        case 58:   // :
	        case 63:   // ?
	        case 126:  // ~
	            ++index;
	            if (extra.tokenize && code === 40) {
	                extra.openParenToken = extra.tokens.length;
	            }

	            return {
	                type: Token.Punctuator,
	                value: String.fromCharCode(code),
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };

	        case 123:  // { open curly brace
	        case 125:  // } close curly brace
	            ++index;
	            if (extra.tokenize && code === 123) {
	                extra.openCurlyToken = extra.tokens.length;
	            }

	            // lookahead2 function can cause tokens to be scanned twice and in doing so
	            // would wreck the curly stack by pushing the same token onto the stack twice.
	            // curlyLastIndex ensures each token is pushed or popped exactly once
	            if (index > state.curlyLastIndex) {
	                state.curlyLastIndex = index;
	                if (code === 123) {
	                    state.curlyStack.push('{');
	                } else {
	                    state.curlyStack.pop();
	                }
	            }

	            return {
	                type: Token.Punctuator,
	                value: String.fromCharCode(code),
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };

	        default:
	            code2 = source.charCodeAt(index + 1);

	            // '=' (char #61) marks an assignment or comparison operator.
	            if (code2 === 61) {
	                switch (code) {
	                case 37:  // %
	                case 38:  // &
	                case 42:  // *:
	                case 43:  // +
	                case 45:  // -
	                case 47:  // /
	                case 60:  // <
	                case 62:  // >
	                case 94:  // ^
	                case 124: // |
	                    index += 2;
	                    return {
	                        type: Token.Punctuator,
	                        value: String.fromCharCode(code) + String.fromCharCode(code2),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };

	                case 33: // !
	                case 61: // =
	                    index += 2;

	                    // !== and ===
	                    if (source.charCodeAt(index) === 61) {
	                        ++index;
	                    }
	                    return {
	                        type: Token.Punctuator,
	                        value: source.slice(start, index),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };
	                default:
	                    break;
	                }
	            }
	            break;
	        }

	        // Peek more characters.

	        ch2 = source[index + 1];
	        ch3 = source[index + 2];
	        ch4 = source[index + 3];

	        // 4-character punctuator: >>>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
	            if (ch4 === '=') {
	                index += 4;
	                return {
	                    type: Token.Punctuator,
	                    value: '>>>=',
	                    lineNumber: lineNumber,
	                    lineStart: lineStart,
	                    range: [start, index]
	                };
	            }
	        }

	        // 3-character punctuators: === !== >>> <<= >>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>' && !state.inType) {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '<' && ch2 === '<' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '<<=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '>' && ch2 === '>' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '.' && ch2 === '.' && ch3 === '.') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '...',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        // Other 2-character punctuators: ++ -- << >> && ||

	        // Don't match these tokens if we're in a type, since they never can
	        // occur and can mess up types like Map<string, Array<string>>
	        if (ch1 === ch2 && ('+-<>&|'.indexOf(ch1) >= 0) && !state.inType) {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: ch1 + ch2,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '=' && ch2 === '>') {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: '=>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '.') {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    // 7.8.3 Numeric Literals

	    function scanHexLiteral(start) {
	        var number = '';

	        while (index < length) {
	            if (!isHexDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt('0x' + number, 16),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanBinaryLiteral(start) {
	        var ch, number;

	        number = '';

	        while (index < length) {
	            ch = source[index];
	            if (ch !== '0' && ch !== '1') {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            // only 0b or 0B
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (index < length) {
	            ch = source.charCodeAt(index);
	            /* istanbul ignore else */
	            if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 2),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanOctalLiteral(prefix, start) {
	        var number, octal;

	        if (isOctalDigit(prefix)) {
	            octal = true;
	            number = '0' + source[index++];
	        } else {
	            octal = false;
	            ++index;
	            number = '';
	        }

	        while (index < length) {
	            if (!isOctalDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (!octal && number.length === 0) {
	            // only 0o or 0O
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 8),
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanNumericLiteral() {
	        var number, start, ch;

	        ch = source[index];
	        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
	            'Numeric literal must start with a decimal digit or a decimal point');

	        start = index;
	        number = '';
	        if (ch !== '.') {
	            number = source[index++];
	            ch = source[index];

	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            // Octal number in ES6 starts with '0o'.
	            // Binary number in ES6 starts with '0b'.
	            if (number === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++index;
	                    return scanHexLiteral(start);
	                }
	                if (ch === 'b' || ch === 'B') {
	                    ++index;
	                    return scanBinaryLiteral(start);
	                }
	                if (ch === 'o' || ch === 'O' || isOctalDigit(ch)) {
	                    return scanOctalLiteral(ch, start);
	                }
	                // decimal number starts with '0' such as '09' is illegal.
	                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            }

	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === '.') {
	            number += source[index++];
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === 'e' || ch === 'E') {
	            number += source[index++];

	            ch = source[index];
	            if (ch === '+' || ch === '-') {
	                number += source[index++];
	            }
	            if (isDecimalDigit(source.charCodeAt(index))) {
	                while (isDecimalDigit(source.charCodeAt(index))) {
	                    number += source[index++];
	                }
	            } else {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseFloat(number),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    // 7.8.4 String Literals

	    function scanStringLiteral() {
	        var str = '', quote, start, ch, code, unescaped, restore, octal = false;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        while (index < length) {
	            ch = source[index++];

	            if (ch === quote) {
	                quote = '';
	                break;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        str += '\n';
	                        break;
	                    case 'r':
	                        str += '\r';
	                        break;
	                    case 't':
	                        str += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        if (source[index] === '{') {
	                            ++index;
	                            str += scanUnicodeCodePointEscape();
	                        } else {
	                            restore = index;
	                            unescaped = scanHexEscape(ch);
	                            if (unescaped) {
	                                str += unescaped;
	                            } else {
	                                index = restore;
	                                str += ch;
	                            }
	                        }
	                        break;
	                    case 'b':
	                        str += '\b';
	                        break;
	                    case 'f':
	                        str += '\f';
	                        break;
	                    case 'v':
	                        str += '\x0B';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            /* istanbul ignore else */
	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            str += String.fromCharCode(code);
	                        } else {
	                            str += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            } else {
	                str += ch;
	            }
	        }

	        if (quote !== '') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.StringLiteral,
	            value: str,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanTemplate() {
	        var cooked = '', ch, start, terminated, head, tail, restore, unescaped, code, octal;

	        terminated = false;
	        tail = false;
	        start = index;
	        head = (source[index] === '`');

	        ++index;

	        while (index < length) {
	            ch = source[index++];
	            if (ch === '`') {
	                tail = true;
	                terminated = true;
	                break;
	            } else if (ch === '$') {
	                if (source[index] === '{') {
	                    ++index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        cooked += '\n';
	                        break;
	                    case 'r':
	                        cooked += '\r';
	                        break;
	                    case 't':
	                        cooked += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        if (source[index] === '{') {
	                            ++index;
	                            cooked += scanUnicodeCodePointEscape();
	                        } else {
	                            restore = index;
	                            unescaped = scanHexEscape(ch);
	                            if (unescaped) {
	                                cooked += unescaped;
	                            } else {
	                                index = restore;
	                                cooked += ch;
	                            }
	                        }
	                        break;
	                    case 'b':
	                        cooked += '\b';
	                        break;
	                    case 'f':
	                        cooked += '\f';
	                        break;
	                    case 'v':
	                        cooked += '\v';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            /* istanbul ignore else */
	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            cooked += String.fromCharCode(code);
	                        } else {
	                            cooked += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                ++lineNumber;
	                if (ch === '\r' && source[index] === '\n') {
	                    ++index;
	                }
	                lineStart = index;
	                cooked += '\n';
	            } else {
	                cooked += ch;
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (index > state.curlyLastIndex) {
	            state.curlyLastIndex = index;
	            if (!tail) {
	                state.curlyStack.push('template');
	            }

	            if (!head) {
	                state.curlyStack.pop();
	            }
	        }

	        return {
	            type: Token.Template,
	            value: {
	                cooked: cooked,
	                raw: source.slice(start + 1, index - ((tail) ? 1 : 2))
	            },
	            head: head,
	            tail: tail,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function testRegExp(pattern, flags) {
	        var tmp = pattern,
	            value;

	        if (flags.indexOf('u') >= 0) {
	            // Replace each astral symbol and every Unicode code point
	            // escape sequence with a single ASCII symbol to avoid throwing on
	            // regular expressions that are only valid in combination with the
	            // `/u` flag.
	            // Note: replacing with the ASCII symbol `x` might cause false
	            // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
	            // perfectly valid pattern that is equivalent to `[a-b]`, but it
	            // would be replaced by `[x-b]` which throws an error.
	            tmp = tmp
	                .replace(/\\u\{([0-9a-fA-F]+)\}/g, function ($0, $1) {
	                    if (parseInt($1, 16) <= 0x10FFFF) {
	                        return 'x';
	                    }
	                    throwError({}, Messages.InvalidRegExp);
	                })
	                .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, 'x');
	        }

	        // First, detect invalid regular expressions.
	        try {
	            value = new RegExp(tmp);
	        } catch (e) {
	            throwError({}, Messages.InvalidRegExp);
	        }

	        // Return a regular expression object for this pattern-flag pair, or
	        // `null` in case the current environment doesn't support the flags it
	        // uses.
	        try {
	            return new RegExp(pattern, flags);
	        } catch (exception) {
	            return null;
	        }
	    }

	    function scanRegExpBody() {
	        var ch, str, classMarker, terminated, body;

	        ch = source[index];
	        assert(ch === '/', 'Regular expression literal must start with a slash');
	        str = source[index++];

	        classMarker = false;
	        terminated = false;
	        while (index < length) {
	            ch = source[index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = source[index++];
	                // ECMA-262 7.8.5
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnterminatedRegExp);
	            } else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            } else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                } else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnterminatedRegExp);
	        }

	        // Exclude leading and trailing slash.
	        body = str.substr(1, str.length - 2);
	        return {
	            value: body,
	            literal: str
	        };
	    }

	    function scanRegExpFlags() {
	        var ch, str, flags, restore;

	        str = '';
	        flags = '';
	        while (index < length) {
	            ch = source[index];
	            if (!isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }

	            ++index;
	            if (ch === '\\' && index < length) {
	                ch = source[index];
	                if (ch === 'u') {
	                    ++index;
	                    restore = index;
	                    ch = scanHexEscape('u');
	                    if (ch) {
	                        flags += ch;
	                        for (str += '\\u'; restore < index; ++restore) {
	                            str += source[restore];
	                        }
	                    } else {
	                        index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	                } else {
	                    str += '\\';
	                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else {
	                flags += ch;
	                str += ch;
	            }
	        }

	        return {
	            value: flags,
	            literal: str
	        };
	    }

	    function scanRegExp() {
	        var start, body, flags, value;

	        lookahead = null;
	        skipComment();
	        start = index;

	        body = scanRegExpBody();
	        flags = scanRegExpFlags();
	        value = testRegExp(body.value, flags.value);

	        if (extra.tokenize) {
	            return {
	                type: Token.RegularExpression,
	                value: value,
	                regex: {
	                    pattern: body.value,
	                    flags: flags.value
	                },
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        return {
	            literal: body.literal + flags.literal,
	            value: value,
	            regex: {
	                pattern: body.value,
	                flags: flags.value
	            },
	            range: [start, index]
	        };
	    }

	    function isIdentifierName(token) {
	        return token.type === Token.Identifier ||
	            token.type === Token.Keyword ||
	            token.type === Token.BooleanLiteral ||
	            token.type === Token.NullLiteral;
	    }

	    function advanceSlash() {
	        var prevToken,
	            checkToken;
	        // Using the following algorithm:
	        // https://github.com/mozilla/sweet.js/wiki/design
	        prevToken = extra.tokens[extra.tokens.length - 1];
	        if (!prevToken) {
	            // Nothing before that: it cannot be a division.
	            return scanRegExp();
	        }
	        if (prevToken.type === 'Punctuator') {
	            if (prevToken.value === ')') {
	                checkToken = extra.tokens[extra.openParenToken - 1];
	                if (checkToken &&
	                        checkToken.type === 'Keyword' &&
	                        (checkToken.value === 'if' ||
	                         checkToken.value === 'while' ||
	                         checkToken.value === 'for' ||
	                         checkToken.value === 'with')) {
	                    return scanRegExp();
	                }
	                return scanPunctuator();
	            }
	            if (prevToken.value === '}') {
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                if (extra.tokens[extra.openCurlyToken - 3] &&
	                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
	                    // Anonymous function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 4];
	                    if (!checkToken) {
	                        return scanPunctuator();
	                    }
	                } else if (extra.tokens[extra.openCurlyToken - 4] &&
	                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
	                    // Named function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 5];
	                    if (!checkToken) {
	                        return scanRegExp();
	                    }
	                } else {
	                    return scanPunctuator();
	                }
	                // checkToken determines whether the function is
	                // a declaration or an expression.
	                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
	                    // It is an expression.
	                    return scanPunctuator();
	                }
	                // It is a declaration.
	                return scanRegExp();
	            }
	            return scanRegExp();
	        }
	        if (prevToken.type === 'Keyword' && prevToken.value !== 'this') {
	            return scanRegExp();
	        }
	        return scanPunctuator();
	    }

	    function advance() {
	        var ch;

	        if (!state.inJSXChild) {
	            skipComment();
	        }

	        if (index >= length) {
	            return {
	                type: Token.EOF,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [index, index]
	            };
	        }

	        if (state.inJSXChild) {
	            return advanceJSXChild();
	        }

	        ch = source.charCodeAt(index);

	        // Very common: ( and ) and ;
	        if (ch === 40 || ch === 41 || ch === 58) {
	            return scanPunctuator();
	        }

	        // String literal starts with single quote (#39) or double quote (#34).
	        if (ch === 39 || ch === 34) {
	            if (state.inJSXTag) {
	                return scanJSXStringLiteral();
	            }
	            return scanStringLiteral();
	        }

	        if (state.inJSXTag && isJSXIdentifierStart(ch)) {
	            return scanJSXIdentifier();
	        }

	        // Template literals start with backtick (#96) for template head
	        // or close curly (#125) for template middle or template tail.
	        if (ch === 96 || (ch === 125 && state.curlyStack[state.curlyStack.length - 1] === 'template')) {
	            return scanTemplate();
	        }
	        if (isIdentifierStart(ch)) {
	            return scanIdentifier();
	        }

	        // Dot (.) char #46 can also start a floating-point number, hence the need
	        // to check the next character.
	        if (ch === 46) {
	            if (isDecimalDigit(source.charCodeAt(index + 1))) {
	                return scanNumericLiteral();
	            }
	            return scanPunctuator();
	        }

	        if (isDecimalDigit(ch)) {
	            return scanNumericLiteral();
	        }

	        // Slash (/) char #47 can also start a regex.
	        if (extra.tokenize && ch === 47) {
	            return advanceSlash();
	        }

	        return scanPunctuator();
	    }

	    function lex() {
	        var token;

	        token = lookahead;
	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        lookahead = advance();

	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        return token;
	    }

	    function peek() {
	        var pos, line, start;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        lookahead = advance();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;
	    }

	    function lookahead2() {
	        var adv, pos, line, start, result;

	        // If we are collecting the tokens, don't grab the next one yet.
	        /* istanbul ignore next */
	        adv = (typeof extra.advance === 'function') ? extra.advance : advance;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;

	        // Scan for the next immediate token.
	        /* istanbul ignore if */
	        if (lookahead === null) {
	            lookahead = adv();
	        }
	        index = lookahead.range[1];
	        lineNumber = lookahead.lineNumber;
	        lineStart = lookahead.lineStart;

	        // Grab the token right after.
	        result = adv();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return result;
	    }

	    function rewind(token) {
	        index = token.range[0];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;
	        lookahead = token;
	    }

	    function markerCreate() {
	        if (!extra.loc && !extra.range) {
	            return undefined;
	        }
	        skipComment();
	        return {offset: index, line: lineNumber, col: index - lineStart};
	    }

	    function markerCreatePreserveWhitespace() {
	        if (!extra.loc && !extra.range) {
	            return undefined;
	        }
	        return {offset: index, line: lineNumber, col: index - lineStart};
	    }

	    function processComment(node) {
	        var lastChild,
	            trailingComments,
	            bottomRight = extra.bottomRightStack,
	            last = bottomRight[bottomRight.length - 1];

	        if (node.type === Syntax.Program) {
	            /* istanbul ignore else */
	            if (node.body.length > 0) {
	                return;
	            }
	        }

	        if (extra.trailingComments.length > 0) {
	            if (extra.trailingComments[0].range[0] >= node.range[1]) {
	                trailingComments = extra.trailingComments;
	                extra.trailingComments = [];
	            } else {
	                extra.trailingComments.length = 0;
	            }
	        } else {
	            if (last && last.trailingComments && last.trailingComments[0].range[0] >= node.range[1]) {
	                trailingComments = last.trailingComments;
	                delete last.trailingComments;
	            }
	        }

	        // Eating the stack.
	        if (last) {
	            while (last && last.range[0] >= node.range[0]) {
	                lastChild = last;
	                last = bottomRight.pop();
	            }
	        }

	        if (lastChild) {
	            if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
	                node.leadingComments = lastChild.leadingComments;
	                delete lastChild.leadingComments;
	            }
	        } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
	            node.leadingComments = extra.leadingComments;
	            extra.leadingComments = [];
	        }

	        if (trailingComments) {
	            node.trailingComments = trailingComments;
	        }

	        bottomRight.push(node);
	    }

	    function markerApply(marker, node) {
	        if (extra.range) {
	            node.range = [marker.offset, index];
	        }
	        if (extra.loc) {
	            node.loc = {
	                start: {
	                    line: marker.line,
	                    column: marker.col
	                },
	                end: {
	                    line: lineNumber,
	                    column: index - lineStart
	                }
	            };
	            node = delegate.postProcess(node);
	        }
	        if (extra.attachComment) {
	            processComment(node);
	        }
	        return node;
	    }

	    SyntaxTreeDelegate = {

	        name: 'SyntaxTree',

	        postProcess: function (node) {
	            return node;
	        },

	        createArrayExpression: function (elements) {
	            return {
	                type: Syntax.ArrayExpression,
	                elements: elements
	            };
	        },

	        createAssignmentExpression: function (operator, left, right) {
	            return {
	                type: Syntax.AssignmentExpression,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBinaryExpression: function (operator, left, right) {
	            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
	                        Syntax.BinaryExpression;
	            return {
	                type: type,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBlockStatement: function (body) {
	            return {
	                type: Syntax.BlockStatement,
	                body: body
	            };
	        },

	        createBreakStatement: function (label) {
	            return {
	                type: Syntax.BreakStatement,
	                label: label
	            };
	        },

	        createCallExpression: function (callee, args) {
	            return {
	                type: Syntax.CallExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createCatchClause: function (param, body) {
	            return {
	                type: Syntax.CatchClause,
	                param: param,
	                body: body
	            };
	        },

	        createConditionalExpression: function (test, consequent, alternate) {
	            return {
	                type: Syntax.ConditionalExpression,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createContinueStatement: function (label) {
	            return {
	                type: Syntax.ContinueStatement,
	                label: label
	            };
	        },

	        createDebuggerStatement: function () {
	            return {
	                type: Syntax.DebuggerStatement
	            };
	        },

	        createDoWhileStatement: function (body, test) {
	            return {
	                type: Syntax.DoWhileStatement,
	                body: body,
	                test: test
	            };
	        },

	        createEmptyStatement: function () {
	            return {
	                type: Syntax.EmptyStatement
	            };
	        },

	        createExpressionStatement: function (expression) {
	            return {
	                type: Syntax.ExpressionStatement,
	                expression: expression
	            };
	        },

	        createForStatement: function (init, test, update, body) {
	            return {
	                type: Syntax.ForStatement,
	                init: init,
	                test: test,
	                update: update,
	                body: body
	            };
	        },

	        createForInStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForInStatement,
	                left: left,
	                right: right,
	                body: body,
	                each: false
	            };
	        },

	        createForOfStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForOfStatement,
	                left: left,
	                right: right,
	                body: body
	            };
	        },

	        createFunctionDeclaration: function (id, params, defaults, body, rest, generator, expression,
	                                             isAsync, returnType, typeParameters) {
	            var funDecl = {
	                type: Syntax.FunctionDeclaration,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: generator,
	                expression: expression,
	                returnType: returnType,
	                typeParameters: typeParameters
	            };

	            if (isAsync) {
	                funDecl.async = true;
	            }

	            return funDecl;
	        },

	        createFunctionExpression: function (id, params, defaults, body, rest, generator, expression,
	                                            isAsync, returnType, typeParameters) {
	            var funExpr = {
	                type: Syntax.FunctionExpression,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: generator,
	                expression: expression,
	                returnType: returnType,
	                typeParameters: typeParameters
	            };

	            if (isAsync) {
	                funExpr.async = true;
	            }

	            return funExpr;
	        },

	        createIdentifier: function (name) {
	            return {
	                type: Syntax.Identifier,
	                name: name,
	                // Only here to initialize the shape of the object to ensure
	                // that the 'typeAnnotation' key is ordered before others that
	                // are added later (like 'loc' and 'range'). This just helps
	                // keep the shape of Identifier nodes consistent with everything
	                // else.
	                typeAnnotation: undefined,
	                optional: undefined
	            };
	        },

	        createTypeAnnotation: function (typeAnnotation) {
	            return {
	                type: Syntax.TypeAnnotation,
	                typeAnnotation: typeAnnotation
	            };
	        },

	        createTypeCast: function (expression, typeAnnotation) {
	            return {
	                type: Syntax.TypeCastExpression,
	                expression: expression,
	                typeAnnotation: typeAnnotation
	            };
	        },

	        createFunctionTypeAnnotation: function (params, returnType, rest, typeParameters) {
	            return {
	                type: Syntax.FunctionTypeAnnotation,
	                params: params,
	                returnType: returnType,
	                rest: rest,
	                typeParameters: typeParameters
	            };
	        },

	        createFunctionTypeParam: function (name, typeAnnotation, optional) {
	            return {
	                type: Syntax.FunctionTypeParam,
	                name: name,
	                typeAnnotation: typeAnnotation,
	                optional: optional
	            };
	        },

	        createNullableTypeAnnotation: function (typeAnnotation) {
	            return {
	                type: Syntax.NullableTypeAnnotation,
	                typeAnnotation: typeAnnotation
	            };
	        },

	        createArrayTypeAnnotation: function (elementType) {
	            return {
	                type: Syntax.ArrayTypeAnnotation,
	                elementType: elementType
	            };
	        },

	        createGenericTypeAnnotation: function (id, typeParameters) {
	            return {
	                type: Syntax.GenericTypeAnnotation,
	                id: id,
	                typeParameters: typeParameters
	            };
	        },

	        createQualifiedTypeIdentifier: function (qualification, id) {
	            return {
	                type: Syntax.QualifiedTypeIdentifier,
	                qualification: qualification,
	                id: id
	            };
	        },

	        createTypeParameterDeclaration: function (params) {
	            return {
	                type: Syntax.TypeParameterDeclaration,
	                params: params
	            };
	        },

	        createTypeParameterInstantiation: function (params) {
	            return {
	                type: Syntax.TypeParameterInstantiation,
	                params: params
	            };
	        },

	        createAnyTypeAnnotation: function () {
	            return {
	                type: Syntax.AnyTypeAnnotation
	            };
	        },

	        createBooleanTypeAnnotation: function () {
	            return {
	                type: Syntax.BooleanTypeAnnotation
	            };
	        },

	        createNumberTypeAnnotation: function () {
	            return {
	                type: Syntax.NumberTypeAnnotation
	            };
	        },

	        createStringTypeAnnotation: function () {
	            return {
	                type: Syntax.StringTypeAnnotation
	            };
	        },

	        createStringLiteralTypeAnnotation: function (token) {
	            return {
	                type: Syntax.StringLiteralTypeAnnotation,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	        },

	        createVoidTypeAnnotation: function () {
	            return {
	                type: Syntax.VoidTypeAnnotation
	            };
	        },

	        createTypeofTypeAnnotation: function (argument) {
	            return {
	                type: Syntax.TypeofTypeAnnotation,
	                argument: argument
	            };
	        },

	        createTupleTypeAnnotation: function (types) {
	            return {
	                type: Syntax.TupleTypeAnnotation,
	                types: types
	            };
	        },

	        createObjectTypeAnnotation: function (properties, indexers, callProperties) {
	            return {
	                type: Syntax.ObjectTypeAnnotation,
	                properties: properties,
	                indexers: indexers,
	                callProperties: callProperties
	            };
	        },

	        createObjectTypeIndexer: function (id, key, value, isStatic) {
	            return {
	                type: Syntax.ObjectTypeIndexer,
	                id: id,
	                key: key,
	                value: value,
	                static: isStatic
	            };
	        },

	        createObjectTypeCallProperty: function (value, isStatic) {
	            return {
	                type: Syntax.ObjectTypeCallProperty,
	                value: value,
	                static: isStatic
	            };
	        },

	        createObjectTypeProperty: function (key, value, optional, isStatic) {
	            return {
	                type: Syntax.ObjectTypeProperty,
	                key: key,
	                value: value,
	                optional: optional,
	                static: isStatic
	            };
	        },

	        createUnionTypeAnnotation: function (types) {
	            return {
	                type: Syntax.UnionTypeAnnotation,
	                types: types
	            };
	        },

	        createIntersectionTypeAnnotation: function (types) {
	            return {
	                type: Syntax.IntersectionTypeAnnotation,
	                types: types
	            };
	        },

	        createTypeAlias: function (id, typeParameters, right) {
	            return {
	                type: Syntax.TypeAlias,
	                id: id,
	                typeParameters: typeParameters,
	                right: right
	            };
	        },

	        createInterface: function (id, typeParameters, body, extended) {
	            return {
	                type: Syntax.InterfaceDeclaration,
	                id: id,
	                typeParameters: typeParameters,
	                body: body,
	                extends: extended
	            };
	        },

	        createInterfaceExtends: function (id, typeParameters) {
	            return {
	                type: Syntax.InterfaceExtends,
	                id: id,
	                typeParameters: typeParameters
	            };
	        },

	        createDeclareFunction: function (id) {
	            return {
	                type: Syntax.DeclareFunction,
	                id: id
	            };
	        },

	        createDeclareVariable: function (id) {
	            return {
	                type: Syntax.DeclareVariable,
	                id: id
	            };
	        },

	        createDeclareModule: function (id, body) {
	            return {
	                type: Syntax.DeclareModule,
	                id: id,
	                body: body
	            };
	        },

	        createJSXAttribute: function (name, value) {
	            return {
	                type: Syntax.JSXAttribute,
	                name: name,
	                value: value || null
	            };
	        },

	        createJSXSpreadAttribute: function (argument) {
	            return {
	                type: Syntax.JSXSpreadAttribute,
	                argument: argument
	            };
	        },

	        createJSXIdentifier: function (name) {
	            return {
	                type: Syntax.JSXIdentifier,
	                name: name
	            };
	        },

	        createJSXNamespacedName: function (namespace, name) {
	            return {
	                type: Syntax.JSXNamespacedName,
	                namespace: namespace,
	                name: name
	            };
	        },

	        createJSXMemberExpression: function (object, property) {
	            return {
	                type: Syntax.JSXMemberExpression,
	                object: object,
	                property: property
	            };
	        },

	        createJSXElement: function (openingElement, closingElement, children) {
	            return {
	                type: Syntax.JSXElement,
	                openingElement: openingElement,
	                closingElement: closingElement,
	                children: children
	            };
	        },

	        createJSXEmptyExpression: function () {
	            return {
	                type: Syntax.JSXEmptyExpression
	            };
	        },

	        createJSXExpressionContainer: function (expression) {
	            return {
	                type: Syntax.JSXExpressionContainer,
	                expression: expression
	            };
	        },

	        createJSXOpeningElement: function (name, attributes, selfClosing) {
	            return {
	                type: Syntax.JSXOpeningElement,
	                name: name,
	                selfClosing: selfClosing,
	                attributes: attributes
	            };
	        },

	        createJSXClosingElement: function (name) {
	            return {
	                type: Syntax.JSXClosingElement,
	                name: name
	            };
	        },

	        createIfStatement: function (test, consequent, alternate) {
	            return {
	                type: Syntax.IfStatement,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createLabeledStatement: function (label, body) {
	            return {
	                type: Syntax.LabeledStatement,
	                label: label,
	                body: body
	            };
	        },

	        createLiteral: function (token) {
	            var object = {
	                type: Syntax.Literal,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	            if (token.regex) {
	                object.regex = token.regex;
	            }
	            return object;
	        },

	        createMemberExpression: function (accessor, object, property) {
	            return {
	                type: Syntax.MemberExpression,
	                computed: accessor === '[',
	                object: object,
	                property: property
	            };
	        },

	        createNewExpression: function (callee, args) {
	            return {
	                type: Syntax.NewExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createObjectExpression: function (properties) {
	            return {
	                type: Syntax.ObjectExpression,
	                properties: properties
	            };
	        },

	        createPostfixExpression: function (operator, argument) {
	            return {
	                type: Syntax.UpdateExpression,
	                operator: operator,
	                argument: argument,
	                prefix: false
	            };
	        },

	        createProgram: function (body) {
	            return {
	                type: Syntax.Program,
	                body: body
	            };
	        },

	        createProperty: function (kind, key, value, method, shorthand, computed) {
	            return {
	                type: Syntax.Property,
	                key: key,
	                value: value,
	                kind: kind,
	                method: method,
	                shorthand: shorthand,
	                computed: computed
	            };
	        },

	        createReturnStatement: function (argument) {
	            return {
	                type: Syntax.ReturnStatement,
	                argument: argument
	            };
	        },

	        createSequenceExpression: function (expressions) {
	            return {
	                type: Syntax.SequenceExpression,
	                expressions: expressions
	            };
	        },

	        createSwitchCase: function (test, consequent) {
	            return {
	                type: Syntax.SwitchCase,
	                test: test,
	                consequent: consequent
	            };
	        },

	        createSwitchStatement: function (discriminant, cases) {
	            return {
	                type: Syntax.SwitchStatement,
	                discriminant: discriminant,
	                cases: cases
	            };
	        },

	        createThisExpression: function () {
	            return {
	                type: Syntax.ThisExpression
	            };
	        },

	        createThrowStatement: function (argument) {
	            return {
	                type: Syntax.ThrowStatement,
	                argument: argument
	            };
	        },

	        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
	            return {
	                type: Syntax.TryStatement,
	                block: block,
	                guardedHandlers: guardedHandlers,
	                handlers: handlers,
	                finalizer: finalizer
	            };
	        },

	        createUnaryExpression: function (operator, argument) {
	            if (operator === '++' || operator === '--') {
	                return {
	                    type: Syntax.UpdateExpression,
	                    operator: operator,
	                    argument: argument,
	                    prefix: true
	                };
	            }
	            return {
	                type: Syntax.UnaryExpression,
	                operator: operator,
	                argument: argument,
	                prefix: true
	            };
	        },

	        createVariableDeclaration: function (declarations, kind) {
	            return {
	                type: Syntax.VariableDeclaration,
	                declarations: declarations,
	                kind: kind
	            };
	        },

	        createVariableDeclarator: function (id, init) {
	            return {
	                type: Syntax.VariableDeclarator,
	                id: id,
	                init: init
	            };
	        },

	        createWhileStatement: function (test, body) {
	            return {
	                type: Syntax.WhileStatement,
	                test: test,
	                body: body
	            };
	        },

	        createWithStatement: function (object, body) {
	            return {
	                type: Syntax.WithStatement,
	                object: object,
	                body: body
	            };
	        },

	        createTemplateElement: function (value, tail) {
	            return {
	                type: Syntax.TemplateElement,
	                value: value,
	                tail: tail
	            };
	        },

	        createTemplateLiteral: function (quasis, expressions) {
	            return {
	                type: Syntax.TemplateLiteral,
	                quasis: quasis,
	                expressions: expressions
	            };
	        },

	        createSpreadElement: function (argument) {
	            return {
	                type: Syntax.SpreadElement,
	                argument: argument
	            };
	        },

	        createSpreadProperty: function (argument) {
	            return {
	                type: Syntax.SpreadProperty,
	                argument: argument
	            };
	        },

	        createTaggedTemplateExpression: function (tag, quasi) {
	            return {
	                type: Syntax.TaggedTemplateExpression,
	                tag: tag,
	                quasi: quasi
	            };
	        },

	        createArrowFunctionExpression: function (params, defaults, body, rest, expression, isAsync) {
	            var arrowExpr = {
	                type: Syntax.ArrowFunctionExpression,
	                id: null,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: false,
	                expression: expression
	            };

	            if (isAsync) {
	                arrowExpr.async = true;
	            }

	            return arrowExpr;
	        },

	        createMethodDefinition: function (propertyType, kind, key, value, computed) {
	            return {
	                type: Syntax.MethodDefinition,
	                key: key,
	                value: value,
	                kind: kind,
	                'static': propertyType === ClassPropertyType.static,
	                computed: computed
	            };
	        },

	        createClassProperty: function (key, typeAnnotation, computed, isStatic) {
	            return {
	                type: Syntax.ClassProperty,
	                key: key,
	                typeAnnotation: typeAnnotation,
	                computed: computed,
	                static: isStatic
	            };
	        },

	        createClassBody: function (body) {
	            return {
	                type: Syntax.ClassBody,
	                body: body
	            };
	        },

	        createClassImplements: function (id, typeParameters) {
	            return {
	                type: Syntax.ClassImplements,
	                id: id,
	                typeParameters: typeParameters
	            };
	        },

	        createClassExpression: function (id, superClass, body, typeParameters, superTypeParameters, implemented) {
	            return {
	                type: Syntax.ClassExpression,
	                id: id,
	                superClass: superClass,
	                body: body,
	                typeParameters: typeParameters,
	                superTypeParameters: superTypeParameters,
	                implements: implemented
	            };
	        },

	        createClassDeclaration: function (id, superClass, body, typeParameters, superTypeParameters, implemented) {
	            return {
	                type: Syntax.ClassDeclaration,
	                id: id,
	                superClass: superClass,
	                body: body,
	                typeParameters: typeParameters,
	                superTypeParameters: superTypeParameters,
	                implements: implemented
	            };
	        },

	        createExportSpecifier: function (id, name) {
	            return {
	                type: Syntax.ExportSpecifier,
	                id: id,
	                name: name
	            };
	        },

	        createExportBatchSpecifier: function () {
	            return {
	                type: Syntax.ExportBatchSpecifier
	            };
	        },

	        createImportDefaultSpecifier: function (id) {
	            return {
	                type: Syntax.ImportDefaultSpecifier,
	                id: id
	            };
	        },

	        createImportNamespaceSpecifier: function (id) {
	            return {
	                type: Syntax.ImportNamespaceSpecifier,
	                id: id
	            };
	        },

	        createExportDeclaration: function (isDefault, declaration, specifiers, src) {
	            return {
	                type: Syntax.ExportDeclaration,
	                'default': !!isDefault,
	                declaration: declaration,
	                specifiers: specifiers,
	                source: src
	            };
	        },

	        createImportSpecifier: function (id, name) {
	            return {
	                type: Syntax.ImportSpecifier,
	                id: id,
	                name: name
	            };
	        },

	        createImportDeclaration: function (specifiers, src, importKind) {
	            return {
	                type: Syntax.ImportDeclaration,
	                specifiers: specifiers,
	                source: src,
	                importKind: importKind
	            };
	        },

	        createYieldExpression: function (argument, dlg) {
	            return {
	                type: Syntax.YieldExpression,
	                argument: argument,
	                delegate: dlg
	            };
	        },

	        createAwaitExpression: function (argument) {
	            return {
	                type: Syntax.AwaitExpression,
	                argument: argument
	            };
	        },

	        createComprehensionExpression: function (filter, blocks, body) {
	            return {
	                type: Syntax.ComprehensionExpression,
	                filter: filter,
	                blocks: blocks,
	                body: body
	            };
	        }

	    };

	    // Return true if there is a line terminator before the next token.

	    function peekLineTerminator() {
	        var pos, line, start, found;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        skipComment();
	        found = lineNumber !== line;
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return found;
	    }

	    // Throw an exception

	    function throwError(token, messageFormat) {
	        var error,
	            args = Array.prototype.slice.call(arguments, 2),
	            msg = messageFormat.replace(
	                /%(\d)/g,
	                function (whole, idx) {
	                    assert(idx < args.length, 'Message reference must be in range');
	                    return args[idx];
	                }
	            );

	        if (typeof token.lineNumber === 'number') {
	            error = new Error('Line ' + token.lineNumber + ': ' + msg);
	            error.index = token.range[0];
	            error.lineNumber = token.lineNumber;
	            error.column = token.range[0] - lineStart + 1;
	        } else {
	            error = new Error('Line ' + lineNumber + ': ' + msg);
	            error.index = index;
	            error.lineNumber = lineNumber;
	            error.column = index - lineStart + 1;
	        }

	        error.description = msg;
	        throw error;
	    }

	    function throwErrorTolerant() {
	        try {
	            throwError.apply(null, arguments);
	        } catch (e) {
	            if (extra.errors) {
	                extra.errors.push(e);
	            } else {
	                throw e;
	            }
	        }
	    }


	    // Throw an exception because of the token.

	    function throwUnexpected(token) {
	        if (token.type === Token.EOF) {
	            throwError(token, Messages.UnexpectedEOS);
	        }

	        if (token.type === Token.NumericLiteral) {
	            throwError(token, Messages.UnexpectedNumber);
	        }

	        if (token.type === Token.StringLiteral || token.type === Token.JSXText) {
	            throwError(token, Messages.UnexpectedString);
	        }

	        if (token.type === Token.Identifier) {
	            throwError(token, Messages.UnexpectedIdentifier);
	        }

	        if (token.type === Token.Keyword) {
	            if (isFutureReservedWord(token.value)) {
	                throwError(token, Messages.UnexpectedReserved);
	            } else if (strict && isStrictModeReservedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictReservedWord);
	                return;
	            }
	            throwError(token, Messages.UnexpectedToken, token.value);
	        }

	        if (token.type === Token.Template) {
	            throwError(token, Messages.UnexpectedTemplate, token.value.raw);
	        }

	        // BooleanLiteral, NullLiteral, or Punctuator.
	        throwError(token, Messages.UnexpectedToken, token.value);
	    }

	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.

	    function expect(value) {
	        var token = lex();
	        if (token.type !== Token.Punctuator || token.value !== value) {
	            throwUnexpected(token);
	        }
	    }

	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.

	    function expectKeyword(keyword, contextual) {
	        var token = lex();
	        if (token.type !== (contextual ? Token.Identifier : Token.Keyword) ||
	                token.value !== keyword) {
	            throwUnexpected(token);
	        }
	    }

	    // Expect the next token to match the specified contextual keyword.
	    // If not, an exception will be thrown.

	    function expectContextualKeyword(keyword) {
	        return expectKeyword(keyword, true);
	    }

	    // Return true if the next token matches the specified punctuator.

	    function match(value) {
	        return lookahead.type === Token.Punctuator && lookahead.value === value;
	    }

	    // Return true if the next token matches the specified keyword

	    function matchKeyword(keyword, contextual) {
	        var expectedType = contextual ? Token.Identifier : Token.Keyword;
	        return lookahead.type === expectedType && lookahead.value === keyword;
	    }

	    // Return true if the next token matches the specified contextual keyword

	    function matchContextualKeyword(keyword) {
	        return matchKeyword(keyword, true);
	    }

	    // Return true if the next token is an assignment operator

	    function matchAssign() {
	        var op;

	        if (lookahead.type !== Token.Punctuator) {
	            return false;
	        }
	        op = lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    }

	    // Note that 'yield' is treated as a keyword in strict mode, but a
	    // contextual keyword (identifier) in non-strict mode, so we need to
	    // use matchKeyword('yield', false) and matchKeyword('yield', true)
	    // (i.e. matchContextualKeyword) appropriately.
	    function matchYield() {
	        return state.yieldAllowed && matchKeyword('yield', !strict);
	    }

	    function matchAsync() {
	        var backtrackToken = lookahead, matches = false;

	        if (matchContextualKeyword('async')) {
	            lex(); // Make sure peekLineTerminator() starts after 'async'.
	            matches = !peekLineTerminator();
	            rewind(backtrackToken); // Revert the lex().
	        }

	        return matches;
	    }

	    function matchAwait() {
	        return state.awaitAllowed && matchContextualKeyword('await');
	    }

	    function consumeSemicolon() {
	        var line, oldIndex = index, oldLineNumber = lineNumber,
	            oldLineStart = lineStart, oldLookahead = lookahead;

	        // Catch the very common case first: immediately a semicolon (char #59).
	        if (source.charCodeAt(index) === 59) {
	            lex();
	            return;
	        }

	        line = lineNumber;
	        skipComment();
	        if (lineNumber !== line) {
	            index = oldIndex;
	            lineNumber = oldLineNumber;
	            lineStart = oldLineStart;
	            lookahead = oldLookahead;
	            return;
	        }

	        if (match(';')) {
	            lex();
	            return;
	        }

	        if (lookahead.type !== Token.EOF && !match('}')) {
	            throwUnexpected(lookahead);
	        }
	    }

	    // Return true if provided expression is LeftHandSideExpression

	    function isLeftHandSide(expr) {
	        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
	    }

	    function isAssignableLeftHandSide(expr) {
	        return isLeftHandSide(expr) || expr.type === Syntax.ObjectPattern || expr.type === Syntax.ArrayPattern;
	    }

	    // 11.1.4 Array Initialiser

	    function parseArrayInitialiser() {
	        var elements = [], blocks = [], filter = null, tmp, possiblecomprehension = true,
	            marker = markerCreate();

	        expect('[');
	        while (!match(']')) {
	            if (lookahead.value === 'for' &&
	                    lookahead.type === Token.Keyword) {
	                if (!possiblecomprehension) {
	                    throwError({}, Messages.ComprehensionError);
	                }
	                matchKeyword('for');
	                tmp = parseForStatement({ignoreBody: true});
	                tmp.of = tmp.type === Syntax.ForOfStatement;
	                tmp.type = Syntax.ComprehensionBlock;
	                if (tmp.left.kind) { // can't be let or const
	                    throwError({}, Messages.ComprehensionError);
	                }
	                blocks.push(tmp);
	            } else if (lookahead.value === 'if' &&
	                           lookahead.type === Token.Keyword) {
	                if (!possiblecomprehension) {
	                    throwError({}, Messages.ComprehensionError);
	                }
	                expectKeyword('if');
	                expect('(');
	                filter = parseExpression();
	                expect(')');
	            } else if (lookahead.value === ',' &&
	                           lookahead.type === Token.Punctuator) {
	                possiblecomprehension = false; // no longer allowed.
	                lex();
	                elements.push(null);
	            } else {
	                tmp = parseSpreadOrAssignmentExpression();
	                elements.push(tmp);
	                if (tmp && tmp.type === Syntax.SpreadElement) {
	                    if (!match(']')) {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                } else if (!(match(']') || matchKeyword('for') || matchKeyword('if'))) {
	                    expect(','); // this lexes.
	                    possiblecomprehension = false;
	                }
	            }
	        }

	        expect(']');

	        if (filter && !blocks.length) {
	            throwError({}, Messages.ComprehensionRequiresBlock);
	        }

	        if (blocks.length) {
	            if (elements.length !== 1) {
	                throwError({}, Messages.ComprehensionError);
	            }
	            return markerApply(marker, delegate.createComprehensionExpression(filter, blocks, elements[0]));
	        }
	        return markerApply(marker, delegate.createArrayExpression(elements));
	    }

	    // 11.1.5 Object Initialiser

	    function parsePropertyFunction(options) {
	        var previousStrict, previousYieldAllowed, previousAwaitAllowed,
	            params, defaults, body, marker = markerCreate();

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = options.generator;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = options.async;
	        params = options.params || [];
	        defaults = options.defaults || [];

	        body = parseConciseBody();
	        if (options.name && strict && isRestrictedWord(params[0].name)) {
	            throwErrorTolerant(options.name, Messages.StrictParamName);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(marker, delegate.createFunctionExpression(
	            null,
	            params,
	            defaults,
	            body,
	            options.rest || null,
	            options.generator,
	            body.type !== Syntax.BlockStatement,
	            options.async,
	            options.returnType,
	            options.typeParameters
	        ));
	    }


	    function parsePropertyMethodFunction(options) {
	        var previousStrict, tmp, method;

	        previousStrict = strict;
	        strict = true;

	        tmp = parseParams();

	        if (tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, tmp.message);
	        }

	        method = parsePropertyFunction({
	            params: tmp.params,
	            defaults: tmp.defaults,
	            rest: tmp.rest,
	            generator: options.generator,
	            async: options.async,
	            returnType: tmp.returnType,
	            typeParameters: options.typeParameters
	        });

	        strict = previousStrict;

	        return method;
	    }


	    function parseObjectPropertyKey() {
	        var marker = markerCreate(),
	            token = lex(),
	            propertyKey,
	            result;

	        // Note: This function is called only from parseObjectProperty(), where
	        // EOF and Punctuator tokens are already filtered out.

	        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
	            if (strict && token.octal) {
	                throwErrorTolerant(token, Messages.StrictOctalLiteral);
	            }
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (token.type === Token.Punctuator && token.value === '[') {
	            // For computed properties we should skip the [ and ], and
	            // capture in marker only the assignment expression itself.
	            marker = markerCreate();
	            propertyKey = parseAssignmentExpression();
	            result = markerApply(marker, propertyKey);
	            expect(']');
	            return result;
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseObjectProperty() {
	        var token, key, id, param, computed,
	            marker = markerCreate(), returnType, typeParameters;

	        token = lookahead;
	        computed = (token.value === '[' && token.type === Token.Punctuator);

	        if (token.type === Token.Identifier || computed || matchAsync()) {
	            id = parseObjectPropertyKey();

	            if (match(':')) {
	                lex();

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'init',
	                        id,
	                        parseAssignmentExpression(),
	                        false,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (match('(') || match('<')) {
	                if (match('<')) {
	                    typeParameters = parseTypeParameterDeclaration();
	                }
	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'init',
	                        id,
	                        parsePropertyMethodFunction({
	                            generator: false,
	                            async: false,
	                            typeParameters: typeParameters
	                        }),
	                        true,
	                        false,
	                        computed
	                    )
	                );
	            }

	            // Property Assignment: Getter and Setter.

	            if (token.value === 'get') {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();

	                expect('(');
	                expect(')');
	                if (match(':')) {
	                    returnType = parseTypeAnnotation();
	                }

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'get',
	                        key,
	                        parsePropertyFunction({
	                            generator: false,
	                            async: false,
	                            returnType: returnType
	                        }),
	                        false,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (token.value === 'set') {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();

	                expect('(');
	                token = lookahead;
	                param = [ parseTypeAnnotatableIdentifier() ];
	                expect(')');
	                if (match(':')) {
	                    returnType = parseTypeAnnotation();
	                }

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'set',
	                        key,
	                        parsePropertyFunction({
	                            params: param,
	                            generator: false,
	                            async: false,
	                            name: token,
	                            returnType: returnType
	                        }),
	                        false,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (token.value === 'async') {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();

	                if (match('<')) {
	                    typeParameters = parseTypeParameterDeclaration();
	                }

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'init',
	                        key,
	                        parsePropertyMethodFunction({
	                            generator: false,
	                            async: true,
	                            typeParameters: typeParameters
	                        }),
	                        true,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (computed) {
	                // Computed properties can only be used with full notation.
	                throwUnexpected(lookahead);
	            }

	            return markerApply(
	                marker,
	                delegate.createProperty('init', id, id, false, true, false)
	            );
	        }

	        if (token.type === Token.EOF || token.type === Token.Punctuator) {
	            if (!match('*')) {
	                throwUnexpected(token);
	            }
	            lex();

	            computed = (lookahead.type === Token.Punctuator && lookahead.value === '[');

	            id = parseObjectPropertyKey();

	            if (match('<')) {
	                typeParameters = parseTypeParameterDeclaration();
	            }

	            if (!match('(')) {
	                throwUnexpected(lex());
	            }

	            return markerApply(marker, delegate.createProperty(
	                'init',
	                id,
	                parsePropertyMethodFunction({
	                    generator: true,
	                    typeParameters: typeParameters
	                }),
	                true,
	                false,
	                computed
	            ));
	        }
	        key = parseObjectPropertyKey();
	        if (match(':')) {
	            lex();
	            return markerApply(marker, delegate.createProperty('init', key, parseAssignmentExpression(), false, false, false));
	        }
	        if (match('(') || match('<')) {
	            if (match('<')) {
	                typeParameters = parseTypeParameterDeclaration();
	            }
	            return markerApply(marker, delegate.createProperty(
	                'init',
	                key,
	                parsePropertyMethodFunction({
	                    generator: false,
	                    typeParameters: typeParameters
	                }),
	                true,
	                false,
	                false
	            ));
	        }
	        throwUnexpected(lex());
	    }

	    function parseObjectSpreadProperty() {
	        var marker = markerCreate();
	        expect('...');
	        return markerApply(marker, delegate.createSpreadProperty(parseAssignmentExpression()));
	    }

	    function getFieldName(key) {
	        var toString = String;
	        if (key.type === Syntax.Identifier) {
	            return key.name;
	        }
	        return toString(key.value);
	    }

	    function parseObjectInitialiser() {
	        var properties = [], property, name, kind, storedKind, map = new StringMap(),
	            marker = markerCreate(), toString = String;

	        expect('{');

	        while (!match('}')) {
	            if (match('...')) {
	                property = parseObjectSpreadProperty();
	            } else {
	                property = parseObjectProperty();

	                if (property.key.type === Syntax.Identifier) {
	                    name = property.key.name;
	                } else {
	                    name = toString(property.key.value);
	                }
	                kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;

	                if (map.has(name)) {
	                    storedKind = map.get(name);
	                    if (storedKind === PropertyKind.Data) {
	                        if (strict && kind === PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.StrictDuplicateProperty);
	                        } else if (kind !== PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.AccessorDataProperty);
	                        }
	                    } else {
	                        if (kind === PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.AccessorDataProperty);
	                        } else if (storedKind & kind) {
	                            throwErrorTolerant({}, Messages.AccessorGetSet);
	                        }
	                    }
	                    map.set(name, storedKind | kind);
	                } else {
	                    map.set(name, kind);
	                }
	            }

	            properties.push(property);

	            if (!match('}')) {
	                expect(',');
	            }
	        }

	        expect('}');

	        return markerApply(marker, delegate.createObjectExpression(properties));
	    }

	    function parseTemplateElement(option) {
	        var marker, token;

	        if (lookahead.type !== Token.Template || (option.head && !lookahead.head)) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        marker = markerCreate();
	        token = lex();

	        if (strict && token.octal) {
	            throwError(token, Messages.StrictOctalLiteral);
	        }
	        return markerApply(marker, delegate.createTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail));
	    }

	    function parseTemplateLiteral() {
	        var quasi, quasis, expressions, marker = markerCreate();

	        quasi = parseTemplateElement({ head: true });
	        quasis = [ quasi ];
	        expressions = [];

	        while (!quasi.tail) {
	            expressions.push(parseExpression());
	            quasi = parseTemplateElement({ head: false });
	            quasis.push(quasi);
	        }

	        return markerApply(marker, delegate.createTemplateLiteral(quasis, expressions));
	    }

	    // 11.1.6 The Grouping Operator

	    function parseGroupExpression() {
	        var expr, marker, typeAnnotation;

	        expect('(');

	        ++state.parenthesizedCount;

	        marker = markerCreate();

	        expr = parseExpression();

	        if (match(':')) {
	            typeAnnotation = parseTypeAnnotation();
	            expr = markerApply(marker, delegate.createTypeCast(
	                expr,
	                typeAnnotation
	            ));
	        }

	        expect(')');

	        return expr;
	    }

	    function matchAsyncFuncExprOrDecl() {
	        var token;

	        if (matchAsync()) {
	            token = lookahead2();
	            if (token.type === Token.Keyword && token.value === 'function') {
	                return true;
	            }
	        }

	        return false;
	    }

	    // 11.1 Primary Expressions

	    function parsePrimaryExpression() {
	        var marker, type, token, expr;

	        type = lookahead.type;

	        if (type === Token.Identifier) {
	            marker = markerCreate();
	            return markerApply(marker, delegate.createIdentifier(lex().value));
	        }

	        if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            marker = markerCreate();
	            return markerApply(marker, delegate.createLiteral(lex()));
	        }

	        if (type === Token.Keyword) {
	            if (matchKeyword('this')) {
	                marker = markerCreate();
	                lex();
	                return markerApply(marker, delegate.createThisExpression());
	            }

	            if (matchKeyword('function')) {
	                return parseFunctionExpression();
	            }

	            if (matchKeyword('class')) {
	                return parseClassExpression();
	            }

	            if (matchKeyword('super')) {
	                marker = markerCreate();
	                lex();
	                return markerApply(marker, delegate.createIdentifier('super'));
	            }
	        }

	        if (type === Token.BooleanLiteral) {
	            marker = markerCreate();
	            token = lex();
	            token.value = (token.value === 'true');
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (type === Token.NullLiteral) {
	            marker = markerCreate();
	            token = lex();
	            token.value = null;
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (match('[')) {
	            return parseArrayInitialiser();
	        }

	        if (match('{')) {
	            return parseObjectInitialiser();
	        }

	        if (match('(')) {
	            return parseGroupExpression();
	        }

	        if (match('/') || match('/=')) {
	            marker = markerCreate();
	            expr = delegate.createLiteral(scanRegExp());
	            peek();
	            return markerApply(marker, expr);
	        }

	        if (type === Token.Template) {
	            return parseTemplateLiteral();
	        }

	        if (match('<')) {
	            return parseJSXElement();
	        }

	        throwUnexpected(lex());
	    }

	    // 11.2 Left-Hand-Side Expressions

	    function parseArguments() {
	        var args = [], arg;

	        expect('(');

	        if (!match(')')) {
	            while (index < length) {
	                arg = parseSpreadOrAssignmentExpression();
	                args.push(arg);

	                if (arg.type === Syntax.SpreadElement) {
	                    if (match(')')) {
	                        break;
	                    } else {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                }

	                if (match(')')) {
	                    break;
	                } else {
	                    expect(',');
	                    if (match(')')) {
	                        break;
	                    }
	                }
	            }
	        }

	        expect(')');

	        return args;
	    }

	    function parseSpreadOrAssignmentExpression() {
	        if (match('...')) {
	            var marker = markerCreate();
	            lex();
	            return markerApply(marker, delegate.createSpreadElement(parseAssignmentExpression()));
	        }
	        return parseAssignmentExpression();
	    }

	    function parseNonComputedProperty() {
	        var marker = markerCreate(),
	            token = lex();

	        if (!isIdentifierName(token)) {
	            throwUnexpected(token);
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseNonComputedMember() {
	        expect('.');

	        return parseNonComputedProperty();
	    }

	    function parseComputedMember() {
	        var expr;

	        expect('[');

	        expr = parseExpression();

	        expect(']');

	        return expr;
	    }

	    function parseNewExpression() {
	        var callee, args, marker = markerCreate();

	        expectKeyword('new');
	        callee = parseLeftHandSideExpression();
	        args = match('(') ? parseArguments() : [];

	        return markerApply(marker, delegate.createNewExpression(callee, args));
	    }

	    function parseLeftHandSideExpressionAllowCall() {
	        var expr, args, marker = markerCreate();

	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

	        while (match('.') || match('[') || match('(') || (lookahead.type === Token.Template && lookahead.head)) {
	            if (match('(')) {
	                args = parseArguments();
	                expr = markerApply(marker, delegate.createCallExpression(expr, args));
	            } else if (match('[')) {
	                expr = markerApply(marker, delegate.createMemberExpression('[', expr, parseComputedMember()));
	            } else if (match('.')) {
	                expr = markerApply(marker, delegate.createMemberExpression('.', expr, parseNonComputedMember()));
	            } else {
	                expr = markerApply(marker, delegate.createTaggedTemplateExpression(expr, parseTemplateLiteral()));
	            }
	        }

	        return expr;
	    }

	    function parseLeftHandSideExpression() {
	        var expr, marker = markerCreate();

	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

	        while (match('.') || match('[') || (lookahead.type === Token.Template && lookahead.head)) {
	            if (match('[')) {
	                expr = markerApply(marker, delegate.createMemberExpression('[', expr, parseComputedMember()));
	            } else if (match('.')) {
	                expr = markerApply(marker, delegate.createMemberExpression('.', expr, parseNonComputedMember()));
	            } else {
	                expr = markerApply(marker, delegate.createTaggedTemplateExpression(expr, parseTemplateLiteral()));
	            }
	        }

	        return expr;
	    }

	    // 11.3 Postfix Expressions

	    function parsePostfixExpression() {
	        var marker = markerCreate(),
	            expr = parseLeftHandSideExpressionAllowCall(),
	            token;

	        if (lookahead.type !== Token.Punctuator) {
	            return expr;
	        }

	        if ((match('++') || match('--')) && !peekLineTerminator()) {
	            // 11.3.1, 11.3.2
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPostfix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            token = lex();
	            expr = markerApply(marker, delegate.createPostfixExpression(token.value, expr));
	        }

	        return expr;
	    }

	    // 11.4 Unary Operators

	    function parseUnaryExpression() {
	        var marker, token, expr;

	        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	            return parsePostfixExpression();
	        }

	        if (match('++') || match('--')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            // 11.4.4, 11.4.5
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPrefix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            return markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	        }

	        if (match('+') || match('-') || match('~') || match('!')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            return markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	        }

	        if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
	                throwErrorTolerant({}, Messages.StrictDelete);
	            }
	            return expr;
	        }

	        return parsePostfixExpression();
	    }

	    function binaryPrecedence(token, allowIn) {
	        var prec = 0;

	        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	            return 0;
	        }

	        switch (token.value) {
	        case '||':
	            prec = 1;
	            break;

	        case '&&':
	            prec = 2;
	            break;

	        case '|':
	            prec = 3;
	            break;

	        case '^':
	            prec = 4;
	            break;

	        case '&':
	            prec = 5;
	            break;

	        case '==':
	        case '!=':
	        case '===':
	        case '!==':
	            prec = 6;
	            break;

	        case '<':
	        case '>':
	        case '<=':
	        case '>=':
	        case 'instanceof':
	            prec = 7;
	            break;

	        case 'in':
	            prec = allowIn ? 7 : 0;
	            break;

	        case '<<':
	        case '>>':
	        case '>>>':
	            prec = 8;
	            break;

	        case '+':
	        case '-':
	            prec = 9;
	            break;

	        case '*':
	        case '/':
	        case '%':
	            prec = 11;
	            break;

	        default:
	            break;
	        }

	        return prec;
	    }

	    // 11.5 Multiplicative Operators
	    // 11.6 Additive Operators
	    // 11.7 Bitwise Shift Operators
	    // 11.8 Relational Operators
	    // 11.9 Equality Operators
	    // 11.10 Binary Bitwise Operators
	    // 11.11 Binary Logical Operators

	    function parseBinaryExpression() {
	        var expr, token, prec, previousAllowIn, stack, right, operator, left, i,
	            marker, markers;

	        previousAllowIn = state.allowIn;
	        state.allowIn = true;

	        marker = markerCreate();
	        left = parseUnaryExpression();

	        token = lookahead;
	        prec = binaryPrecedence(token, previousAllowIn);
	        if (prec === 0) {
	            return left;
	        }
	        token.prec = prec;
	        lex();

	        markers = [marker, markerCreate()];
	        right = parseUnaryExpression();

	        stack = [left, token, right];

	        while ((prec = binaryPrecedence(lookahead, previousAllowIn)) > 0) {

	            // Reduce: make a binary expression from the three topmost entries.
	            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
	                right = stack.pop();
	                operator = stack.pop().value;
	                left = stack.pop();
	                expr = delegate.createBinaryExpression(operator, left, right);
	                markers.pop();
	                marker = markers.pop();
	                markerApply(marker, expr);
	                stack.push(expr);
	                markers.push(marker);
	            }

	            // Shift.
	            token = lex();
	            token.prec = prec;
	            stack.push(token);
	            markers.push(markerCreate());
	            expr = parseUnaryExpression();
	            stack.push(expr);
	        }

	        state.allowIn = previousAllowIn;

	        // Final reduce to clean-up the stack.
	        i = stack.length - 1;
	        expr = stack[i];
	        markers.pop();
	        while (i > 1) {
	            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	            i -= 2;
	            marker = markers.pop();
	            markerApply(marker, expr);
	        }

	        return expr;
	    }


	    // 11.12 Conditional Operator

	    function parseConditionalExpression() {
	        var expr, previousAllowIn, consequent, alternate, marker = markerCreate();
	        expr = parseBinaryExpression();

	        if (match('?')) {
	            lex();
	            previousAllowIn = state.allowIn;
	            state.allowIn = true;
	            consequent = parseAssignmentExpression();
	            state.allowIn = previousAllowIn;
	            expect(':');
	            alternate = parseAssignmentExpression();

	            expr = markerApply(marker, delegate.createConditionalExpression(expr, consequent, alternate));
	        }

	        return expr;
	    }

	    // 11.13 Assignment Operators

	    // 12.14.5 AssignmentPattern

	    function reinterpretAsAssignmentBindingPattern(expr) {
	        var i, len, property, element;

	        if (expr.type === Syntax.ObjectExpression) {
	            expr.type = Syntax.ObjectPattern;
	            for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                property = expr.properties[i];
	                if (property.type === Syntax.SpreadProperty) {
	                    if (i < len - 1) {
	                        throwError({}, Messages.PropertyAfterSpreadProperty);
	                    }
	                    reinterpretAsAssignmentBindingPattern(property.argument);
	                } else {
	                    if (property.kind !== 'init') {
	                        throwError({}, Messages.InvalidLHSInAssignment);
	                    }
	                    reinterpretAsAssignmentBindingPattern(property.value);
	                }
	            }
	        } else if (expr.type === Syntax.ArrayExpression) {
	            expr.type = Syntax.ArrayPattern;
	            for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                element = expr.elements[i];
	                /* istanbul ignore else */
	                if (element) {
	                    reinterpretAsAssignmentBindingPattern(element);
	                }
	            }
	        } else if (expr.type === Syntax.Identifier) {
	            if (isRestrictedWord(expr.name)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }
	        } else if (expr.type === Syntax.SpreadElement) {
	            reinterpretAsAssignmentBindingPattern(expr.argument);
	            if (expr.argument.type === Syntax.ObjectPattern) {
	                throwError({}, Messages.ObjectPatternAsSpread);
	            }
	        } else {
	            /* istanbul ignore else */
	            if (expr.type !== Syntax.MemberExpression && expr.type !== Syntax.CallExpression && expr.type !== Syntax.NewExpression) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }
	        }
	    }

	    // 13.2.3 BindingPattern

	    function reinterpretAsDestructuredParameter(options, expr) {
	        var i, len, property, element;

	        if (expr.type === Syntax.ObjectExpression) {
	            expr.type = Syntax.ObjectPattern;
	            for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                property = expr.properties[i];
	                if (property.type === Syntax.SpreadProperty) {
	                    if (i < len - 1) {
	                        throwError({}, Messages.PropertyAfterSpreadProperty);
	                    }
	                    reinterpretAsDestructuredParameter(options, property.argument);
	                } else {
	                    if (property.kind !== 'init') {
	                        throwError({}, Messages.InvalidLHSInFormalsList);
	                    }
	                    reinterpretAsDestructuredParameter(options, property.value);
	                }
	            }
	        } else if (expr.type === Syntax.ArrayExpression) {
	            expr.type = Syntax.ArrayPattern;
	            for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                element = expr.elements[i];
	                if (element) {
	                    reinterpretAsDestructuredParameter(options, element);
	                }
	            }
	        } else if (expr.type === Syntax.Identifier) {
	            validateParam(options, expr, expr.name);
	        } else if (expr.type === Syntax.SpreadElement) {
	            // BindingRestElement only allows BindingIdentifier
	            if (expr.argument.type !== Syntax.Identifier) {
	                throwError({}, Messages.InvalidLHSInFormalsList);
	            }
	            validateParam(options, expr.argument, expr.argument.name);
	        } else {
	            throwError({}, Messages.InvalidLHSInFormalsList);
	        }
	    }

	    function reinterpretAsCoverFormalsList(expressions) {
	        var i, len, param, params, defaults, defaultCount, options, rest;

	        params = [];
	        defaults = [];
	        defaultCount = 0;
	        rest = null;
	        options = {
	            paramSet: new StringMap()
	        };

	        for (i = 0, len = expressions.length; i < len; i += 1) {
	            param = expressions[i];
	            if (param.type === Syntax.Identifier) {
	                params.push(param);
	                defaults.push(null);
	                validateParam(options, param, param.name);
	            } else if (param.type === Syntax.ObjectExpression || param.type === Syntax.ArrayExpression) {
	                reinterpretAsDestructuredParameter(options, param);
	                params.push(param);
	                defaults.push(null);
	            } else if (param.type === Syntax.SpreadElement) {
	                assert(i === len - 1, 'It is guaranteed that SpreadElement is last element by parseExpression');
	                if (param.argument.type !== Syntax.Identifier) {
	                    throwError({}, Messages.InvalidLHSInFormalsList);
	                }
	                reinterpretAsDestructuredParameter(options, param.argument);
	                rest = param.argument;
	            } else if (param.type === Syntax.AssignmentExpression) {
	                params.push(param.left);
	                defaults.push(param.right);
	                ++defaultCount;
	                validateParam(options, param.left, param.left.name);
	            } else {
	                return null;
	            }
	        }

	        if (options.message === Messages.StrictParamDupe) {
	            throwError(
	                strict ? options.stricted : options.firstRestricted,
	                options.message
	            );
	        }

	        if (defaultCount === 0) {
	            defaults = [];
	        }

	        return {
	            params: params,
	            defaults: defaults,
	            rest: rest,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    }

	    function parseArrowFunctionExpression(options, marker) {
	        var previousStrict, previousYieldAllowed, previousAwaitAllowed, body;

	        expect('=>');

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = false;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = !!options.async;
	        body = parseConciseBody();

	        if (strict && options.firstRestricted) {
	            throwError(options.firstRestricted, options.message);
	        }
	        if (strict && options.stricted) {
	            throwErrorTolerant(options.stricted, options.message);
	        }

	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(marker, delegate.createArrowFunctionExpression(
	            options.params,
	            options.defaults,
	            body,
	            options.rest,
	            body.type !== Syntax.BlockStatement,
	            !!options.async
	        ));
	    }

	    function parseAssignmentExpression() {
	        var marker, expr, token, params, oldParenthesizedCount,
	            startsWithParen = false, backtrackToken = lookahead,
	            possiblyAsync = false;

	        if (matchYield()) {
	            return parseYieldExpression();
	        }

	        if (matchAwait()) {
	            return parseAwaitExpression();
	        }

	        oldParenthesizedCount = state.parenthesizedCount;

	        marker = markerCreate();

	        if (matchAsyncFuncExprOrDecl()) {
	            return parseFunctionExpression();
	        }

	        if (matchAsync()) {
	            // We can't be completely sure that this 'async' token is
	            // actually a contextual keyword modifying a function
	            // expression, so we might have to un-lex() it later by
	            // calling rewind(backtrackToken).
	            possiblyAsync = true;
	            lex();
	        }

	        if (match('(')) {
	            token = lookahead2();
	            if ((token.type === Token.Punctuator && token.value === ')') || token.value === '...') {
	                params = parseParams();
	                if (!match('=>')) {
	                    throwUnexpected(lex());
	                }
	                params.async = possiblyAsync;
	                return parseArrowFunctionExpression(params, marker);
	            }
	            startsWithParen = true;
	        }

	        token = lookahead;

	        // If the 'async' keyword is not followed by a '(' character or an
	        // identifier, then it can't be an arrow function modifier, and we
	        // should interpret it as a normal identifer.
	        if (possiblyAsync && !match('(') && token.type !== Token.Identifier) {
	            possiblyAsync = false;
	            rewind(backtrackToken);
	        }

	        expr = parseConditionalExpression();

	        if (match('=>') &&
	                (state.parenthesizedCount === oldParenthesizedCount ||
	                state.parenthesizedCount === (oldParenthesizedCount + 1))) {
	            if (expr.type === Syntax.Identifier) {
	                params = reinterpretAsCoverFormalsList([ expr ]);
	            } else if (expr.type === Syntax.AssignmentExpression ||
	                    expr.type === Syntax.ArrayExpression ||
	                    expr.type === Syntax.ObjectExpression) {
	                if (!startsWithParen) {
	                    throwUnexpected(lex());
	                }
	                params = reinterpretAsCoverFormalsList([ expr ]);
	            } else if (expr.type === Syntax.SequenceExpression) {
	                params = reinterpretAsCoverFormalsList(expr.expressions);
	            }
	            if (params) {
	                params.async = possiblyAsync;
	                return parseArrowFunctionExpression(params, marker);
	            }
	        }

	        // If we haven't returned by now, then the 'async' keyword was not
	        // a function modifier, and we should rewind and interpret it as a
	        // normal identifier.
	        if (possiblyAsync) {
	            possiblyAsync = false;
	            rewind(backtrackToken);
	            expr = parseConditionalExpression();
	        }

	        if (matchAssign()) {
	            // 11.13.1
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant(token, Messages.StrictLHSAssignment);
	            }

	            // ES.next draf 11.13 Runtime Semantics step 1
	            if (match('=') && (expr.type === Syntax.ObjectExpression || expr.type === Syntax.ArrayExpression)) {
	                reinterpretAsAssignmentBindingPattern(expr);
	            } else if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            expr = markerApply(marker, delegate.createAssignmentExpression(lex().value, expr, parseAssignmentExpression()));
	        }

	        return expr;
	    }

	    // 11.14 Comma Operator

	    function parseExpression() {
	        var marker, expr, expressions, sequence, spreadFound, possibleArrow;

	        marker = markerCreate();
	        expr = parseAssignmentExpression();
	        expressions = [ expr ];

	        if (match(',')) {
	            while (index < length) {
	                if (!match(',')) {
	                    break;
	                }

	                lex();

	                if (match(')')) {
	                    possibleArrow = lookahead2();
	                    if (
	                        possibleArrow.type === Token.Punctuator &&
	                        possibleArrow.value === '=>'
	                    ) {
	                        break;
	                    }
	                }

	                expr = parseSpreadOrAssignmentExpression();
	                expressions.push(expr);

	                if (expr.type === Syntax.SpreadElement) {
	                    spreadFound = true;
	                    if (!match(')')) {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                    break;
	                }
	            }

	            if (expressions.length > 1) {
	                sequence = markerApply(marker, delegate.createSequenceExpression(expressions));
	            }
	        }

	        if (spreadFound && lookahead2().value !== '=>') {
	            throwError({}, Messages.IllegalSpread);
	        }

	        return sequence || expr;
	    }

	    // 12.1 Block

	    function parseStatementList() {
	        var list = [],
	            statement;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            statement = parseSourceElement();
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            list.push(statement);
	        }

	        return list;
	    }

	    function parseBlock() {
	        var block, marker = markerCreate();

	        expect('{');

	        block = parseStatementList();

	        expect('}');

	        return markerApply(marker, delegate.createBlockStatement(block));
	    }

	    // 12.2 Variable Statement

	    function parseTypeParameterDeclaration() {
	        var marker = markerCreate(), paramTypes = [];

	        expect('<');
	        while (!match('>')) {
	            paramTypes.push(parseTypeAnnotatableIdentifier());
	            if (!match('>')) {
	                expect(',');
	            }
	        }
	        expect('>');

	        return markerApply(marker, delegate.createTypeParameterDeclaration(
	            paramTypes
	        ));
	    }

	    function parseTypeParameterInstantiation() {
	        var marker = markerCreate(), oldInType = state.inType, paramTypes = [];

	        state.inType = true;

	        expect('<');
	        while (!match('>')) {
	            paramTypes.push(parseType());
	            if (!match('>')) {
	                expect(',');
	            }
	        }
	        expect('>');

	        state.inType = oldInType;

	        return markerApply(marker, delegate.createTypeParameterInstantiation(
	            paramTypes
	        ));
	    }

	    function parseObjectTypeIndexer(marker, isStatic) {
	        var id, key, value;

	        expect('[');
	        id = parseObjectPropertyKey();
	        expect(':');
	        key = parseType();
	        expect(']');
	        expect(':');
	        value = parseType();

	        return markerApply(marker, delegate.createObjectTypeIndexer(
	            id,
	            key,
	            value,
	            isStatic
	        ));
	    }

	    function parseObjectTypeMethodish(marker) {
	        var params = [], rest = null, returnType, typeParameters = null;
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        expect('(');
	        while (lookahead.type === Token.Identifier) {
	            params.push(parseFunctionTypeParam());
	            if (!match(')')) {
	                expect(',');
	            }
	        }

	        if (match('...')) {
	            lex();
	            rest = parseFunctionTypeParam();
	        }
	        expect(')');
	        expect(':');
	        returnType = parseType();

	        return markerApply(marker, delegate.createFunctionTypeAnnotation(
	            params,
	            returnType,
	            rest,
	            typeParameters
	        ));
	    }

	    function parseObjectTypeMethod(marker, isStatic, key) {
	        var optional = false, value;
	        value = parseObjectTypeMethodish(marker);

	        return markerApply(marker, delegate.createObjectTypeProperty(
	            key,
	            value,
	            optional,
	            isStatic
	        ));
	    }

	    function parseObjectTypeCallProperty(marker, isStatic) {
	        var valueMarker = markerCreate();
	        return markerApply(marker, delegate.createObjectTypeCallProperty(
	            parseObjectTypeMethodish(valueMarker),
	            isStatic
	        ));
	    }

	    function parseObjectType(allowStatic) {
	        var callProperties = [], indexers = [], marker, optional = false,
	            properties = [], propertyKey, propertyTypeAnnotation,
	            token, isStatic, matchStatic;

	        expect('{');

	        while (!match('}')) {
	            marker = markerCreate();
	            matchStatic =
	                   strict
	                   ? matchKeyword('static')
	                   : matchContextualKeyword('static');

	            if (allowStatic && matchStatic) {
	                token = lex();
	                isStatic = true;
	            }

	            if (match('[')) {
	                indexers.push(parseObjectTypeIndexer(marker, isStatic));
	            } else if (match('(') || match('<')) {
	                callProperties.push(parseObjectTypeCallProperty(marker, allowStatic));
	            } else {
	                if (isStatic && match(':')) {
	                    propertyKey = markerApply(marker, delegate.createIdentifier(token));
	                    throwErrorTolerant(token, Messages.StrictReservedWord);
	                } else {
	                    propertyKey = parseObjectPropertyKey();
	                }
	                if (match('<') || match('(')) {
	                    // This is a method property
	                    properties.push(parseObjectTypeMethod(marker, isStatic, propertyKey));
	                } else {
	                    if (match('?')) {
	                        lex();
	                        optional = true;
	                    }
	                    expect(':');
	                    propertyTypeAnnotation = parseType();
	                    properties.push(markerApply(marker, delegate.createObjectTypeProperty(
	                        propertyKey,
	                        propertyTypeAnnotation,
	                        optional,
	                        isStatic
	                    )));
	                }
	            }

	            if (match(';') || match(',')) {
	                lex();
	            } else if (!match('}')) {
	                throwUnexpected(lookahead);
	            }
	        }

	        expect('}');

	        return delegate.createObjectTypeAnnotation(
	            properties,
	            indexers,
	            callProperties
	        );
	    }

	    function parseGenericType() {
	        var marker = markerCreate(),
	            typeParameters = null, typeIdentifier;

	        typeIdentifier = parseVariableIdentifier();

	        while (match('.')) {
	            expect('.');
	            typeIdentifier = markerApply(marker, delegate.createQualifiedTypeIdentifier(
	                typeIdentifier,
	                parseVariableIdentifier()
	            ));
	        }

	        if (match('<')) {
	            typeParameters = parseTypeParameterInstantiation();
	        }

	        return markerApply(marker, delegate.createGenericTypeAnnotation(
	            typeIdentifier,
	            typeParameters
	        ));
	    }

	    function parseVoidType() {
	        var marker = markerCreate();
	        expectKeyword('void');
	        return markerApply(marker, delegate.createVoidTypeAnnotation());
	    }

	    function parseTypeofType() {
	        var argument, marker = markerCreate();
	        expectKeyword('typeof');
	        argument = parsePrimaryType();
	        return markerApply(marker, delegate.createTypeofTypeAnnotation(
	            argument
	        ));
	    }

	    function parseTupleType() {
	        var marker = markerCreate(), types = [];
	        expect('[');
	        // We allow trailing commas
	        while (index < length && !match(']')) {
	            types.push(parseType());
	            if (match(']')) {
	                break;
	            }
	            expect(',');
	        }
	        expect(']');
	        return markerApply(marker, delegate.createTupleTypeAnnotation(
	            types
	        ));
	    }

	    function parseFunctionTypeParam() {
	        var marker = markerCreate(), name, optional = false, typeAnnotation;
	        name = parseVariableIdentifier();
	        if (match('?')) {
	            lex();
	            optional = true;
	        }
	        expect(':');
	        typeAnnotation = parseType();
	        return markerApply(marker, delegate.createFunctionTypeParam(
	            name,
	            typeAnnotation,
	            optional
	        ));
	    }

	    function parseFunctionTypeParams() {
	        var ret = { params: [], rest: null };
	        while (lookahead.type === Token.Identifier) {
	            ret.params.push(parseFunctionTypeParam());
	            if (!match(')')) {
	                expect(',');
	            }
	        }

	        if (match('...')) {
	            lex();
	            ret.rest = parseFunctionTypeParam();
	        }
	        return ret;
	    }

	    // The parsing of types roughly parallels the parsing of expressions, and
	    // primary types are kind of like primary expressions...they're the
	    // primitives with which other types are constructed.
	    function parsePrimaryType() {
	        var params = null, returnType = null,
	            marker = markerCreate(), rest = null, tmp,
	            typeParameters, token, type, isGroupedType = false;

	        switch (lookahead.type) {
	        case Token.Identifier:
	            switch (lookahead.value) {
	            case 'any':
	                lex();
	                return markerApply(marker, delegate.createAnyTypeAnnotation());
	            case 'bool':  // fallthrough
	            case 'boolean':
	                lex();
	                return markerApply(marker, delegate.createBooleanTypeAnnotation());
	            case 'number':
	                lex();
	                return markerApply(marker, delegate.createNumberTypeAnnotation());
	            case 'string':
	                lex();
	                return markerApply(marker, delegate.createStringTypeAnnotation());
	            }
	            return markerApply(marker, parseGenericType());
	        case Token.Punctuator:
	            switch (lookahead.value) {
	            case '{':
	                return markerApply(marker, parseObjectType());
	            case '[':
	                return parseTupleType();
	            case '<':
	                typeParameters = parseTypeParameterDeclaration();
	                expect('(');
	                tmp = parseFunctionTypeParams();
	                params = tmp.params;
	                rest = tmp.rest;
	                expect(')');

	                expect('=>');

	                returnType = parseType();

	                return markerApply(marker, delegate.createFunctionTypeAnnotation(
	                    params,
	                    returnType,
	                    rest,
	                    typeParameters
	                ));
	            case '(':
	                lex();
	                // Check to see if this is actually a grouped type
	                if (!match(')') && !match('...')) {
	                    if (lookahead.type === Token.Identifier) {
	                        token = lookahead2();
	                        isGroupedType = token.value !== '?' && token.value !== ':';
	                    } else {
	                        isGroupedType = true;
	                    }
	                }

	                if (isGroupedType) {
	                    type = parseType();
	                    expect(')');

	                    // If we see a => next then someone was probably confused about
	                    // function types, so we can provide a better error message
	                    if (match('=>')) {
	                        throwError({}, Messages.ConfusedAboutFunctionType);
	                    }

	                    return type;
	                }

	                tmp = parseFunctionTypeParams();
	                params = tmp.params;
	                rest = tmp.rest;

	                expect(')');

	                expect('=>');

	                returnType = parseType();

	                return markerApply(marker, delegate.createFunctionTypeAnnotation(
	                    params,
	                    returnType,
	                    rest,
	                    null /* typeParameters */
	                ));
	            }
	            break;
	        case Token.Keyword:
	            switch (lookahead.value) {
	            case 'void':
	                return markerApply(marker, parseVoidType());
	            case 'typeof':
	                return markerApply(marker, parseTypeofType());
	            }
	            break;
	        case Token.StringLiteral:
	            token = lex();
	            if (token.octal) {
	                throwError(token, Messages.StrictOctalLiteral);
	            }
	            return markerApply(marker, delegate.createStringLiteralTypeAnnotation(
	                token
	            ));
	        }

	        throwUnexpected(lookahead);
	    }

	    function parsePostfixType() {
	        var marker = markerCreate(), t = parsePrimaryType();
	        if (match('[')) {
	            expect('[');
	            expect(']');
	            return markerApply(marker, delegate.createArrayTypeAnnotation(t));
	        }
	        return t;
	    }

	    function parsePrefixType() {
	        var marker = markerCreate();
	        if (match('?')) {
	            lex();
	            return markerApply(marker, delegate.createNullableTypeAnnotation(
	                parsePrefixType()
	            ));
	        }
	        return parsePostfixType();
	    }


	    function parseIntersectionType() {
	        var marker = markerCreate(), type, types;
	        type = parsePrefixType();
	        types = [type];
	        while (match('&')) {
	            lex();
	            types.push(parsePrefixType());
	        }

	        return types.length === 1 ?
	                type :
	                markerApply(marker, delegate.createIntersectionTypeAnnotation(
	                    types
	                ));
	    }

	    function parseUnionType() {
	        var marker = markerCreate(), type, types;
	        type = parseIntersectionType();
	        types = [type];
	        while (match('|')) {
	            lex();
	            types.push(parseIntersectionType());
	        }
	        return types.length === 1 ?
	                type :
	                markerApply(marker, delegate.createUnionTypeAnnotation(
	                    types
	                ));
	    }

	    function parseType() {
	        var oldInType = state.inType, type;
	        state.inType = true;

	        type = parseUnionType();

	        state.inType = oldInType;
	        return type;
	    }

	    function parseTypeAnnotation() {
	        var marker = markerCreate(), type;

	        expect(':');
	        type = parseType();

	        return markerApply(marker, delegate.createTypeAnnotation(type));
	    }

	    function parseVariableIdentifier() {
	        var marker = markerCreate(),
	            token = lex();

	        if (token.type !== Token.Identifier) {
	            throwUnexpected(token);
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseTypeAnnotatableIdentifier(requireTypeAnnotation, canBeOptionalParam) {
	        var marker = markerCreate(),
	            ident = parseVariableIdentifier(),
	            isOptionalParam = false;

	        if (canBeOptionalParam && match('?')) {
	            expect('?');
	            isOptionalParam = true;
	        }

	        if (requireTypeAnnotation || match(':')) {
	            ident.typeAnnotation = parseTypeAnnotation();
	            ident = markerApply(marker, ident);
	        }

	        if (isOptionalParam) {
	            ident.optional = true;
	            ident = markerApply(marker, ident);
	        }

	        return ident;
	    }

	    function parseVariableDeclaration(kind) {
	        var id,
	            marker = markerCreate(),
	            init = null,
	            typeAnnotationMarker = markerCreate();
	        if (match('{')) {
	            id = parseObjectInitialiser();
	            reinterpretAsAssignmentBindingPattern(id);
	            if (match(':')) {
	                id.typeAnnotation = parseTypeAnnotation();
	                markerApply(typeAnnotationMarker, id);
	            }
	        } else if (match('[')) {
	            id = parseArrayInitialiser();
	            reinterpretAsAssignmentBindingPattern(id);
	            if (match(':')) {
	                id.typeAnnotation = parseTypeAnnotation();
	                markerApply(typeAnnotationMarker, id);
	            }
	        } else {
	            /* istanbul ignore next */
	            id = state.allowKeyword ? parseNonComputedProperty() : parseTypeAnnotatableIdentifier();
	            // 12.2.1
	            if (strict && isRestrictedWord(id.name)) {
	                throwErrorTolerant({}, Messages.StrictVarName);
	            }
	        }

	        if (kind === 'const') {
	            if (!match('=')) {
	                throwError({}, Messages.NoUninitializedConst);
	            }
	            expect('=');
	            init = parseAssignmentExpression();
	        } else if (match('=')) {
	            lex();
	            init = parseAssignmentExpression();
	        }

	        return markerApply(marker, delegate.createVariableDeclarator(id, init));
	    }

	    function parseVariableDeclarationList(kind) {
	        var list = [];

	        do {
	            list.push(parseVariableDeclaration(kind));
	            if (!match(',')) {
	                break;
	            }
	            lex();
	        } while (index < length);

	        return list;
	    }

	    function parseVariableStatement() {
	        var declarations, marker = markerCreate();

	        expectKeyword('var');

	        declarations = parseVariableDeclarationList();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, 'var'));
	    }

	    // kind may be `const` or `let`
	    // Both are experimental and not in the specification yet.
	    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
	    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
	    function parseConstLetDeclaration(kind) {
	        var declarations, marker = markerCreate();

	        expectKeyword(kind);

	        declarations = parseVariableDeclarationList(kind);

	        consumeSemicolon();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, kind));
	    }

	    // people.mozilla.org/~jorendorff/es6-draft.html

	    function parseModuleSpecifier() {
	        var marker = markerCreate(),
	            specifier;

	        if (lookahead.type !== Token.StringLiteral) {
	            throwError({}, Messages.InvalidModuleSpecifier);
	        }
	        specifier = delegate.createLiteral(lex());
	        return markerApply(marker, specifier);
	    }

	    function parseExportBatchSpecifier() {
	        var marker = markerCreate();
	        expect('*');
	        return markerApply(marker, delegate.createExportBatchSpecifier());
	    }

	    function parseExportSpecifier() {
	        var id, name = null, marker = markerCreate();
	        if (matchKeyword('default')) {
	            lex();
	            id = markerApply(marker, delegate.createIdentifier('default'));
	            // export {default} from "something";
	        } else {
	            id = parseVariableIdentifier();
	        }
	        if (matchContextualKeyword('as')) {
	            lex();
	            name = parseNonComputedProperty();
	        }

	        return markerApply(marker, delegate.createExportSpecifier(id, name));
	    }

	    function parseExportDeclaration() {
	        var declaration = null,
	            possibleIdentifierToken, sourceElement,
	            isExportFromIdentifier,
	            src = null, specifiers = [],
	            marker = markerCreate();

	        expectKeyword('export');

	        if (matchKeyword('default')) {
	            // covers:
	            // export default ...
	            lex();
	            if (matchKeyword('function') || matchKeyword('class')) {
	                possibleIdentifierToken = lookahead2();
	                if (isIdentifierName(possibleIdentifierToken)) {
	                    // covers:
	                    // export default function foo () {}
	                    // export default class foo {}
	                    sourceElement = parseSourceElement();
	                    return markerApply(marker, delegate.createExportDeclaration(true, sourceElement, [sourceElement.id], null));
	                }
	                // covers:
	                // export default function () {}
	                // export default class {}
	                switch (lookahead.value) {
	                case 'class':
	                    return markerApply(marker, delegate.createExportDeclaration(true, parseClassExpression(), [], null));
	                case 'function':
	                    return markerApply(marker, delegate.createExportDeclaration(true, parseFunctionExpression(), [], null));
	                }
	            }

	            if (matchContextualKeyword('from')) {
	                throwError({}, Messages.UnexpectedToken, lookahead.value);
	            }

	            // covers:
	            // export default {};
	            // export default [];
	            if (match('{')) {
	                declaration = parseObjectInitialiser();
	            } else if (match('[')) {
	                declaration = parseArrayInitialiser();
	            } else {
	                declaration = parseAssignmentExpression();
	            }
	            consumeSemicolon();
	            return markerApply(marker, delegate.createExportDeclaration(true, declaration, [], null));
	        }

	        // non-default export
	        if (lookahead.type === Token.Keyword || matchContextualKeyword('type')) {
	            // covers:
	            // export var f = 1;
	            switch (lookahead.value) {
	            case 'type':
	            case 'let':
	            case 'const':
	            case 'var':
	            case 'class':
	            case 'function':
	                return markerApply(marker, delegate.createExportDeclaration(false, parseSourceElement(), specifiers, null));
	            }
	        }

	        if (match('*')) {
	            // covers:
	            // export * from "foo";
	            specifiers.push(parseExportBatchSpecifier());

	            if (!matchContextualKeyword('from')) {
	                throwError({}, lookahead.value ?
	                        Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	            }
	            lex();
	            src = parseModuleSpecifier();
	            consumeSemicolon();

	            return markerApply(marker, delegate.createExportDeclaration(false, null, specifiers, src));
	        }

	        expect('{');
	        if (!match('}')) {
	            do {
	                isExportFromIdentifier = isExportFromIdentifier || matchKeyword('default');
	                specifiers.push(parseExportSpecifier());
	            } while (match(',') && lex());
	        }
	        expect('}');

	        if (matchContextualKeyword('from')) {
	            // covering:
	            // export {default} from "foo";
	            // export {foo} from "foo";
	            lex();
	            src = parseModuleSpecifier();
	            consumeSemicolon();
	        } else if (isExportFromIdentifier) {
	            // covering:
	            // export {default}; // missing fromClause
	            throwError({}, lookahead.value ?
	                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	        } else {
	            // cover
	            // export {foo};
	            consumeSemicolon();
	        }
	        return markerApply(marker, delegate.createExportDeclaration(false, declaration, specifiers, src));
	    }


	    function parseImportSpecifier() {
	        // import {<foo as bar>} ...;
	        var id, name = null, marker = markerCreate();

	        id = parseNonComputedProperty();
	        if (matchContextualKeyword('as')) {
	            lex();
	            name = parseVariableIdentifier();
	        }

	        return markerApply(marker, delegate.createImportSpecifier(id, name));
	    }

	    function parseNamedImports() {
	        var specifiers = [];
	        // {foo, bar as bas}
	        expect('{');
	        if (!match('}')) {
	            do {
	                specifiers.push(parseImportSpecifier());
	            } while (match(',') && lex());
	        }
	        expect('}');
	        return specifiers;
	    }

	    function parseImportDefaultSpecifier() {
	        // import <foo> ...;
	        var id, marker = markerCreate();

	        id = parseNonComputedProperty();

	        return markerApply(marker, delegate.createImportDefaultSpecifier(id));
	    }

	    function parseImportNamespaceSpecifier() {
	        // import <* as foo> ...;
	        var id, marker = markerCreate();

	        expect('*');
	        if (!matchContextualKeyword('as')) {
	            throwError({}, Messages.NoAsAfterImportNamespace);
	        }
	        lex();
	        id = parseNonComputedProperty();

	        return markerApply(marker, delegate.createImportNamespaceSpecifier(id));
	    }

	    function parseImportDeclaration() {
	        var specifiers, src, marker = markerCreate(), importKind = 'value',
	            token2;

	        expectKeyword('import');

	        if (matchContextualKeyword('type')) {
	            token2 = lookahead2();
	            if ((token2.type === Token.Identifier && token2.value !== 'from') ||
	                    (token2.type === Token.Punctuator &&
	                        (token2.value === '{' || token2.value === '*'))) {
	                importKind = 'type';
	                lex();
	            }
	        } else if (matchKeyword('typeof')) {
	            importKind = 'typeof';
	            lex();
	        }

	        specifiers = [];

	        if (lookahead.type === Token.StringLiteral) {
	            // covers:
	            // import "foo";
	            src = parseModuleSpecifier();
	            consumeSemicolon();
	            return markerApply(marker, delegate.createImportDeclaration(specifiers, src, importKind));
	        }

	        if (!matchKeyword('default') && isIdentifierName(lookahead)) {
	            // covers:
	            // import foo
	            // import foo, ...
	            specifiers.push(parseImportDefaultSpecifier());
	            if (match(',')) {
	                lex();
	            }
	        }
	        if (match('*')) {
	            // covers:
	            // import foo, * as foo
	            // import * as foo
	            specifiers.push(parseImportNamespaceSpecifier());
	        } else if (match('{')) {
	            // covers:
	            // import foo, {bar}
	            // import {bar}
	            specifiers = specifiers.concat(parseNamedImports());
	        }

	        if (!matchContextualKeyword('from')) {
	            throwError({}, lookahead.value ?
	                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	        }
	        lex();
	        src = parseModuleSpecifier();
	        consumeSemicolon();

	        return markerApply(marker, delegate.createImportDeclaration(specifiers, src, importKind));
	    }

	    // 12.3 Empty Statement

	    function parseEmptyStatement() {
	        var marker = markerCreate();
	        expect(';');
	        return markerApply(marker, delegate.createEmptyStatement());
	    }

	    // 12.4 Expression Statement

	    function parseExpressionStatement() {
	        var marker = markerCreate(), expr = parseExpression();
	        consumeSemicolon();
	        return markerApply(marker, delegate.createExpressionStatement(expr));
	    }

	    // 12.5 If statement

	    function parseIfStatement() {
	        var test, consequent, alternate, marker = markerCreate();

	        expectKeyword('if');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        consequent = parseStatement();

	        if (matchKeyword('else')) {
	            lex();
	            alternate = parseStatement();
	        } else {
	            alternate = null;
	        }

	        return markerApply(marker, delegate.createIfStatement(test, consequent, alternate));
	    }

	    // 12.6 Iteration Statements

	    function parseDoWhileStatement() {
	        var body, test, oldInIteration, marker = markerCreate();

	        expectKeyword('do');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        if (match(';')) {
	            lex();
	        }

	        return markerApply(marker, delegate.createDoWhileStatement(body, test));
	    }

	    function parseWhileStatement() {
	        var test, body, oldInIteration, marker = markerCreate();

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        return markerApply(marker, delegate.createWhileStatement(test, body));
	    }

	    function parseForVariableDeclaration() {
	        var marker = markerCreate(),
	            token = lex(),
	            declarations = parseVariableDeclarationList();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, token.value));
	    }

	    function parseForStatement(opts) {
	        var init, test, update, left, right, body, operator, oldInIteration,
	            marker = markerCreate();
	        init = test = update = null;
	        expectKeyword('for');

	        // http://wiki.ecmascript.org/doku.php?id=proposals:iterators_and_generators&s=each
	        if (matchContextualKeyword('each')) {
	            throwError({}, Messages.EachNotAllowed);
	        }

	        expect('(');

	        if (match(';')) {
	            lex();
	        } else {
	            if (matchKeyword('var') || matchKeyword('let') || matchKeyword('const')) {
	                state.allowIn = false;
	                init = parseForVariableDeclaration();
	                state.allowIn = true;

	                if (init.declarations.length === 1) {
	                    if (matchKeyword('in') || matchContextualKeyword('of')) {
	                        operator = lookahead;
	                        if (!((operator.value === 'in' || init.kind !== 'var') && init.declarations[0].init)) {
	                            lex();
	                            left = init;
	                            right = parseExpression();
	                            init = null;
	                        }
	                    }
	                }
	            } else {
	                state.allowIn = false;
	                init = parseExpression();
	                state.allowIn = true;

	                if (matchContextualKeyword('of')) {
	                    operator = lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                } else if (matchKeyword('in')) {
	                    // LeftHandSideExpression
	                    if (!isAssignableLeftHandSide(init)) {
	                        throwError({}, Messages.InvalidLHSInForIn);
	                    }
	                    operator = lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            }

	            if (typeof left === 'undefined') {
	                expect(';');
	            }
	        }

	        if (typeof left === 'undefined') {

	            if (!match(';')) {
	                test = parseExpression();
	            }
	            expect(';');

	            if (!match(')')) {
	                update = parseExpression();
	            }
	        }

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        if (!(opts !== undefined && opts.ignoreBody)) {
	            body = parseStatement();
	        }

	        state.inIteration = oldInIteration;

	        if (typeof left === 'undefined') {
	            return markerApply(marker, delegate.createForStatement(init, test, update, body));
	        }

	        if (operator.value === 'in') {
	            return markerApply(marker, delegate.createForInStatement(left, right, body));
	        }
	        return markerApply(marker, delegate.createForOfStatement(left, right, body));
	    }

	    // 12.7 The continue statement

	    function parseContinueStatement() {
	        var label = null, marker = markerCreate();

	        expectKeyword('continue');

	        // Optimize the most common form: 'continue;'.
	        if (source.charCodeAt(index) === 59) {
	            lex();

	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return markerApply(marker, delegate.createContinueStatement(null));
	        }

	        if (peekLineTerminator()) {
	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return markerApply(marker, delegate.createContinueStatement(null));
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            if (!state.labelSet.has(label.name)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !state.inIteration) {
	            throwError({}, Messages.IllegalContinue);
	        }

	        return markerApply(marker, delegate.createContinueStatement(label));
	    }

	    // 12.8 The break statement

	    function parseBreakStatement() {
	        var label = null, marker = markerCreate();

	        expectKeyword('break');

	        // Catch the very common case first: immediately a semicolon (char #59).
	        if (source.charCodeAt(index) === 59) {
	            lex();

	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return markerApply(marker, delegate.createBreakStatement(null));
	        }

	        if (peekLineTerminator()) {
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return markerApply(marker, delegate.createBreakStatement(null));
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            if (!state.labelSet.has(label.name)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !(state.inIteration || state.inSwitch)) {
	            throwError({}, Messages.IllegalBreak);
	        }

	        return markerApply(marker, delegate.createBreakStatement(label));
	    }

	    // 12.9 The return statement

	    function parseReturnStatement() {
	        var argument = null, marker = markerCreate();

	        expectKeyword('return');

	        if (!state.inFunctionBody) {
	            throwErrorTolerant({}, Messages.IllegalReturn);
	        }

	        // 'return' followed by a space and an identifier is very common.
	        if (source.charCodeAt(index) === 32) {
	            if (isIdentifierStart(source.charCodeAt(index + 1))) {
	                argument = parseExpression();
	                consumeSemicolon();
	                return markerApply(marker, delegate.createReturnStatement(argument));
	            }
	        }

	        if (peekLineTerminator()) {
	            return markerApply(marker, delegate.createReturnStatement(null));
	        }

	        if (!match(';')) {
	            if (!match('}') && lookahead.type !== Token.EOF) {
	                argument = parseExpression();
	            }
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createReturnStatement(argument));
	    }

	    // 12.10 The with statement

	    function parseWithStatement() {
	        var object, body, marker = markerCreate();

	        if (strict) {
	            throwErrorTolerant({}, Messages.StrictModeWith);
	        }

	        expectKeyword('with');

	        expect('(');

	        object = parseExpression();

	        expect(')');

	        body = parseStatement();

	        return markerApply(marker, delegate.createWithStatement(object, body));
	    }

	    // 12.10 The swith statement

	    function parseSwitchCase() {
	        var test,
	            consequent = [],
	            sourceElement,
	            marker = markerCreate();

	        if (matchKeyword('default')) {
	            lex();
	            test = null;
	        } else {
	            expectKeyword('case');
	            test = parseExpression();
	        }
	        expect(':');

	        while (index < length) {
	            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            consequent.push(sourceElement);
	        }

	        return markerApply(marker, delegate.createSwitchCase(test, consequent));
	    }

	    function parseSwitchStatement() {
	        var discriminant, cases, clause, oldInSwitch, defaultFound, marker = markerCreate();

	        expectKeyword('switch');

	        expect('(');

	        discriminant = parseExpression();

	        expect(')');

	        expect('{');

	        cases = [];

	        if (match('}')) {
	            lex();
	            return markerApply(marker, delegate.createSwitchStatement(discriminant, cases));
	        }

	        oldInSwitch = state.inSwitch;
	        state.inSwitch = true;
	        defaultFound = false;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            clause = parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    throwError({}, Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }

	        state.inSwitch = oldInSwitch;

	        expect('}');

	        return markerApply(marker, delegate.createSwitchStatement(discriminant, cases));
	    }

	    // 12.13 The throw statement

	    function parseThrowStatement() {
	        var argument, marker = markerCreate();

	        expectKeyword('throw');

	        if (peekLineTerminator()) {
	            throwError({}, Messages.NewlineAfterThrow);
	        }

	        argument = parseExpression();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createThrowStatement(argument));
	    }

	    // 12.14 The try statement

	    function parseCatchClause() {
	        var param, body, marker = markerCreate();

	        expectKeyword('catch');

	        expect('(');
	        if (match(')')) {
	            throwUnexpected(lookahead);
	        }

	        param = parseExpression();
	        // 12.14.1
	        if (strict && param.type === Syntax.Identifier && isRestrictedWord(param.name)) {
	            throwErrorTolerant({}, Messages.StrictCatchVariable);
	        }

	        expect(')');
	        body = parseBlock();
	        return markerApply(marker, delegate.createCatchClause(param, body));
	    }

	    function parseTryStatement() {
	        var block, handlers = [], finalizer = null, marker = markerCreate();

	        expectKeyword('try');

	        block = parseBlock();

	        if (matchKeyword('catch')) {
	            handlers.push(parseCatchClause());
	        }

	        if (matchKeyword('finally')) {
	            lex();
	            finalizer = parseBlock();
	        }

	        if (handlers.length === 0 && !finalizer) {
	            throwError({}, Messages.NoCatchOrFinally);
	        }

	        return markerApply(marker, delegate.createTryStatement(block, [], handlers, finalizer));
	    }

	    // 12.15 The debugger statement

	    function parseDebuggerStatement() {
	        var marker = markerCreate();
	        expectKeyword('debugger');

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDebuggerStatement());
	    }

	    // 12 Statements

	    function parseStatement() {
	        var type = lookahead.type,
	            marker,
	            expr,
	            labeledBody;

	        if (type === Token.EOF) {
	            throwUnexpected(lookahead);
	        }

	        if (type === Token.Punctuator) {
	            switch (lookahead.value) {
	            case ';':
	                return parseEmptyStatement();
	            case '{':
	                return parseBlock();
	            case '(':
	                return parseExpressionStatement();
	            default:
	                break;
	            }
	        }

	        if (type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'break':
	                return parseBreakStatement();
	            case 'continue':
	                return parseContinueStatement();
	            case 'debugger':
	                return parseDebuggerStatement();
	            case 'do':
	                return parseDoWhileStatement();
	            case 'for':
	                return parseForStatement();
	            case 'function':
	                return parseFunctionDeclaration();
	            case 'class':
	                return parseClassDeclaration();
	            case 'if':
	                return parseIfStatement();
	            case 'return':
	                return parseReturnStatement();
	            case 'switch':
	                return parseSwitchStatement();
	            case 'throw':
	                return parseThrowStatement();
	            case 'try':
	                return parseTryStatement();
	            case 'var':
	                return parseVariableStatement();
	            case 'while':
	                return parseWhileStatement();
	            case 'with':
	                return parseWithStatement();
	            default:
	                break;
	            }
	        }

	        if (matchAsyncFuncExprOrDecl()) {
	            return parseFunctionDeclaration();
	        }

	        marker = markerCreate();
	        expr = parseExpression();

	        // 12.12 Labelled Statements
	        if ((expr.type === Syntax.Identifier) && match(':')) {
	            lex();

	            if (state.labelSet.has(expr.name)) {
	                throwError({}, Messages.Redeclaration, 'Label', expr.name);
	            }

	            state.labelSet.set(expr.name, true);
	            labeledBody = parseStatement();
	            state.labelSet.delete(expr.name);
	            return markerApply(marker, delegate.createLabeledStatement(expr, labeledBody));
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createExpressionStatement(expr));
	    }

	    // 13 Function Definition

	    function parseConciseBody() {
	        if (match('{')) {
	            return parseFunctionSourceElements();
	        }
	        return parseAssignmentExpression();
	    }

	    function parseFunctionSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted,
	            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, oldParenthesizedCount,
	            marker = markerCreate();

	        expect('{');

	        while (index < length) {
	            if (lookahead.type !== Token.StringLiteral) {
	                break;
	            }
	            token = lookahead;

	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        oldLabelSet = state.labelSet;
	        oldInIteration = state.inIteration;
	        oldInSwitch = state.inSwitch;
	        oldInFunctionBody = state.inFunctionBody;
	        oldParenthesizedCount = state.parenthesizedCount;

	        state.labelSet = new StringMap();
	        state.inIteration = false;
	        state.inSwitch = false;
	        state.inFunctionBody = true;
	        state.parenthesizedCount = 0;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }

	        expect('}');

	        state.labelSet = oldLabelSet;
	        state.inIteration = oldInIteration;
	        state.inSwitch = oldInSwitch;
	        state.inFunctionBody = oldInFunctionBody;
	        state.parenthesizedCount = oldParenthesizedCount;

	        return markerApply(marker, delegate.createBlockStatement(sourceElements));
	    }

	    function validateParam(options, param, name) {
	        if (strict) {
	            if (isRestrictedWord(name)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamName;
	            }
	            if (options.paramSet.has(name)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        } else if (!options.firstRestricted) {
	            if (isRestrictedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamName;
	            } else if (isStrictModeReservedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictReservedWord;
	            } else if (options.paramSet.has(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        }
	        options.paramSet.set(name, true);
	    }

	    function parseParam(options) {
	        var marker, token, rest, param, def;

	        token = lookahead;
	        if (token.value === '...') {
	            token = lex();
	            rest = true;
	        }

	        if (match('[')) {
	            marker = markerCreate();
	            param = parseArrayInitialiser();
	            reinterpretAsDestructuredParameter(options, param);
	            if (match(':')) {
	                param.typeAnnotation = parseTypeAnnotation();
	                markerApply(marker, param);
	            }
	        } else if (match('{')) {
	            marker = markerCreate();
	            if (rest) {
	                throwError({}, Messages.ObjectPatternAsRestParameter);
	            }
	            param = parseObjectInitialiser();
	            reinterpretAsDestructuredParameter(options, param);
	            if (match(':')) {
	                param.typeAnnotation = parseTypeAnnotation();
	                markerApply(marker, param);
	            }
	        } else {
	            param =
	                rest
	                ? parseTypeAnnotatableIdentifier(
	                    false, /* requireTypeAnnotation */
	                    false /* canBeOptionalParam */
	                )
	                : parseTypeAnnotatableIdentifier(
	                    false, /* requireTypeAnnotation */
	                    true /* canBeOptionalParam */
	                );

	            validateParam(options, token, token.value);
	        }

	        if (match('=')) {
	            if (rest) {
	                throwErrorTolerant(lookahead, Messages.DefaultRestParameter);
	            }
	            lex();
	            def = parseAssignmentExpression();
	            ++options.defaultCount;
	        }

	        if (rest) {
	            if (!match(')')) {
	                throwError({}, Messages.ParameterAfterRestParameter);
	            }
	            options.rest = param;
	            return false;
	        }

	        options.params.push(param);
	        options.defaults.push(def);
	        return !match(')');
	    }

	    function parseParams(firstRestricted) {
	        var options, marker = markerCreate();

	        options = {
	            params: [],
	            defaultCount: 0,
	            defaults: [],
	            rest: null,
	            firstRestricted: firstRestricted
	        };

	        expect('(');

	        if (!match(')')) {
	            options.paramSet = new StringMap();
	            while (index < length) {
	                if (!parseParam(options)) {
	                    break;
	                }
	                expect(',');
	                if (!options.rest && match(')')) {
	                    break;
	                }
	            }
	        }

	        expect(')');

	        if (options.defaultCount === 0) {
	            options.defaults = [];
	        }

	        if (match(':')) {
	            options.returnType = parseTypeAnnotation();
	        }

	        return markerApply(marker, options);
	    }

	    function parseFunctionDeclaration() {
	        var id, body, token, tmp, firstRestricted, message, generator, isAsync,
	            previousStrict, previousYieldAllowed, previousAwaitAllowed,
	            marker = markerCreate(), typeParameters;

	        isAsync = false;
	        if (matchAsync()) {
	            lex();
	            isAsync = true;
	        }

	        expectKeyword('function');

	        generator = false;
	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        token = lookahead;

	        id = parseVariableIdentifier();

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (strict) {
	            if (isRestrictedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictFunctionName);
	            }
	        } else {
	            if (isRestrictedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictFunctionName;
	            } else if (isStrictModeReservedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictReservedWord;
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = generator;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = isAsync;

	        body = parseFunctionSourceElements();

	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, message);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(
	            marker,
	            delegate.createFunctionDeclaration(
	                id,
	                tmp.params,
	                tmp.defaults,
	                body,
	                tmp.rest,
	                generator,
	                false,
	                isAsync,
	                tmp.returnType,
	                typeParameters
	            )
	        );
	    }

	    function parseFunctionExpression() {
	        var token, id = null, firstRestricted, message, tmp, body, generator, isAsync,
	            previousStrict, previousYieldAllowed, previousAwaitAllowed,
	            marker = markerCreate(), typeParameters;

	        isAsync = false;
	        if (matchAsync()) {
	            lex();
	            isAsync = true;
	        }

	        expectKeyword('function');

	        generator = false;

	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        if (!match('(')) {
	            if (!match('<')) {
	                token = lookahead;
	                id = parseVariableIdentifier();

	                if (strict) {
	                    if (isRestrictedWord(token.value)) {
	                        throwErrorTolerant(token, Messages.StrictFunctionName);
	                    }
	                } else {
	                    if (isRestrictedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictFunctionName;
	                    } else if (isStrictModeReservedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictReservedWord;
	                    }
	                }
	            }

	            if (match('<')) {
	                typeParameters = parseTypeParameterDeclaration();
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = generator;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = isAsync;

	        body = parseFunctionSourceElements();

	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, message);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(
	            marker,
	            delegate.createFunctionExpression(
	                id,
	                tmp.params,
	                tmp.defaults,
	                body,
	                tmp.rest,
	                generator,
	                false,
	                isAsync,
	                tmp.returnType,
	                typeParameters
	            )
	        );
	    }

	    function parseYieldExpression() {
	        var delegateFlag, expr, marker = markerCreate();

	        expectKeyword('yield', !strict);

	        delegateFlag = false;
	        if (match('*')) {
	            lex();
	            delegateFlag = true;
	        }

	        expr = parseAssignmentExpression();

	        return markerApply(marker, delegate.createYieldExpression(expr, delegateFlag));
	    }

	    function parseAwaitExpression() {
	        var expr, marker = markerCreate();
	        expectContextualKeyword('await');
	        expr = parseAssignmentExpression();
	        return markerApply(marker, delegate.createAwaitExpression(expr));
	    }

	    // 14 Functions and classes

	    // 14.1 Functions is defined above (13 in ES5)
	    // 14.2 Arrow Functions Definitions is defined in (7.3 assignments)

	    // 14.3 Method Definitions
	    // 14.3.7
	    function specialMethod(methodDefinition) {
	        return methodDefinition.kind === 'get' ||
	               methodDefinition.kind === 'set' ||
	               methodDefinition.value.generator;
	    }

	    function parseMethodDefinition(key, isStatic, generator, computed) {
	        var token, param, propType,
	            isAsync, typeParameters, tokenValue, returnType;

	        propType = isStatic ? ClassPropertyType.static : ClassPropertyType.prototype;

	        if (generator) {
	            return delegate.createMethodDefinition(
	                propType,
	                '',
	                key,
	                parsePropertyMethodFunction({ generator: true }),
	                computed
	            );
	        }

	        tokenValue = key.type === 'Identifier' && key.name;

	        if (tokenValue === 'get' && !match('(')) {
	            key = parseObjectPropertyKey();

	            expect('(');
	            expect(')');
	            if (match(':')) {
	                returnType = parseTypeAnnotation();
	            }
	            return delegate.createMethodDefinition(
	                propType,
	                'get',
	                key,
	                parsePropertyFunction({ generator: false, returnType: returnType }),
	                computed
	            );
	        }
	        if (tokenValue === 'set' && !match('(')) {
	            key = parseObjectPropertyKey();

	            expect('(');
	            token = lookahead;
	            param = [ parseTypeAnnotatableIdentifier() ];
	            expect(')');
	            if (match(':')) {
	                returnType = parseTypeAnnotation();
	            }
	            return delegate.createMethodDefinition(
	                propType,
	                'set',
	                key,
	                parsePropertyFunction({
	                    params: param,
	                    generator: false,
	                    name: token,
	                    returnType: returnType
	                }),
	                computed
	            );
	        }

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        isAsync = tokenValue === 'async' && !match('(');
	        if (isAsync) {
	            key = parseObjectPropertyKey();
	        }

	        return delegate.createMethodDefinition(
	            propType,
	            '',
	            key,
	            parsePropertyMethodFunction({
	                generator: false,
	                async: isAsync,
	                typeParameters: typeParameters
	            }),
	            computed
	        );
	    }

	    function parseClassProperty(key, computed, isStatic) {
	        var typeAnnotation;

	        typeAnnotation = parseTypeAnnotation();
	        expect(';');

	        return delegate.createClassProperty(
	            key,
	            typeAnnotation,
	            computed,
	            isStatic
	        );
	    }

	    function parseClassElement() {
	        var computed = false, generator = false, key, marker = markerCreate(),
	            isStatic = false, possiblyOpenBracketToken;
	        if (match(';')) {
	            lex();
	            return undefined;
	        }

	        if (lookahead.value === 'static') {
	            lex();
	            isStatic = true;
	        }

	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        possiblyOpenBracketToken = lookahead;
	        if (matchContextualKeyword('get') || matchContextualKeyword('set')) {
	            possiblyOpenBracketToken = lookahead2();
	        }

	        if (possiblyOpenBracketToken.type === Token.Punctuator
	                && possiblyOpenBracketToken.value === '[') {
	            computed = true;
	        }

	        key = parseObjectPropertyKey();

	        if (!generator && lookahead.value === ':') {
	            return markerApply(marker, parseClassProperty(key, computed, isStatic));
	        }

	        return markerApply(marker, parseMethodDefinition(
	            key,
	            isStatic,
	            generator,
	            computed
	        ));
	    }

	    function parseClassBody() {
	        var classElement, classElements = [], existingProps = {},
	            marker = markerCreate(), propName, propType;

	        existingProps[ClassPropertyType.static] = new StringMap();
	        existingProps[ClassPropertyType.prototype] = new StringMap();

	        expect('{');

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            classElement = parseClassElement(existingProps);

	            if (typeof classElement !== 'undefined') {
	                classElements.push(classElement);

	                propName = !classElement.computed && getFieldName(classElement.key);
	                if (propName !== false) {
	                    propType = classElement.static ?
	                                ClassPropertyType.static :
	                                ClassPropertyType.prototype;

	                    if (classElement.type === Syntax.MethodDefinition) {
	                        if (propName === 'constructor' && !classElement.static) {
	                            if (specialMethod(classElement)) {
	                                throwError(classElement, Messages.IllegalClassConstructorProperty);
	                            }
	                            if (existingProps[ClassPropertyType.prototype].has('constructor')) {
	                                throwError(classElement.key, Messages.IllegalDuplicateClassProperty);
	                            }
	                        }
	                        existingProps[propType].set(propName, true);
	                    }
	                }
	            }
	        }

	        expect('}');

	        return markerApply(marker, delegate.createClassBody(classElements));
	    }

	    function parseClassImplements() {
	        var id, implemented = [], marker, typeParameters;
	        if (strict) {
	            expectKeyword('implements');
	        } else {
	            expectContextualKeyword('implements');
	        }
	        while (index < length) {
	            marker = markerCreate();
	            id = parseVariableIdentifier();
	            if (match('<')) {
	                typeParameters = parseTypeParameterInstantiation();
	            } else {
	                typeParameters = null;
	            }
	            implemented.push(markerApply(marker, delegate.createClassImplements(
	                id,
	                typeParameters
	            )));
	            if (!match(',')) {
	                break;
	            }
	            expect(',');
	        }
	        return implemented;
	    }

	    function parseClassExpression() {
	        var id, implemented, previousYieldAllowed, superClass = null,
	            superTypeParameters, marker = markerCreate(), typeParameters,
	            matchImplements;

	        expectKeyword('class');

	        matchImplements =
	                strict
	                ? matchKeyword('implements')
	                : matchContextualKeyword('implements');

	        if (!matchKeyword('extends') && !matchImplements && !match('{')) {
	            id = parseVariableIdentifier();
	        }

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');
	            previousYieldAllowed = state.yieldAllowed;
	            state.yieldAllowed = false;
	            superClass = parseLeftHandSideExpressionAllowCall();
	            if (match('<')) {
	                superTypeParameters = parseTypeParameterInstantiation();
	            }
	            state.yieldAllowed = previousYieldAllowed;
	        }

	        if (strict ? matchKeyword('implements') : matchContextualKeyword('implements')) {
	            implemented = parseClassImplements();
	        }

	        return markerApply(marker, delegate.createClassExpression(
	            id,
	            superClass,
	            parseClassBody(),
	            typeParameters,
	            superTypeParameters,
	            implemented
	        ));
	    }

	    function parseClassDeclaration() {
	        var id, implemented, previousYieldAllowed, superClass = null,
	            superTypeParameters, marker = markerCreate(), typeParameters;

	        expectKeyword('class');

	        id = parseVariableIdentifier();

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');
	            previousYieldAllowed = state.yieldAllowed;
	            state.yieldAllowed = false;
	            superClass = parseLeftHandSideExpressionAllowCall();
	            if (match('<')) {
	                superTypeParameters = parseTypeParameterInstantiation();
	            }
	            state.yieldAllowed = previousYieldAllowed;
	        }

	        if (strict ? matchKeyword('implements') : matchContextualKeyword('implements')) {
	            implemented = parseClassImplements();
	        }

	        return markerApply(marker, delegate.createClassDeclaration(
	            id,
	            superClass,
	            parseClassBody(),
	            typeParameters,
	            superTypeParameters,
	            implemented
	        ));
	    }

	    // 15 Program

	    function parseSourceElement() {
	        var token;
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'const':
	            case 'let':
	                return parseConstLetDeclaration(lookahead.value);
	            case 'function':
	                return parseFunctionDeclaration();
	            case 'export':
	                throwErrorTolerant({}, Messages.IllegalExportDeclaration);
	                return parseExportDeclaration();
	            case 'import':
	                throwErrorTolerant({}, Messages.IllegalImportDeclaration);
	                return parseImportDeclaration();
	            case 'interface':
	                if (lookahead2().type === Token.Identifier) {
	                    return parseInterface();
	                }
	                return parseStatement();
	            default:
	                return parseStatement();
	            }
	        }

	        if (matchContextualKeyword('type')
	                && lookahead2().type === Token.Identifier) {
	            return parseTypeAlias();
	        }

	        if (matchContextualKeyword('interface')
	                && lookahead2().type === Token.Identifier) {
	            return parseInterface();
	        }

	        if (matchContextualKeyword('declare')) {
	            token = lookahead2();
	            if (token.type === Token.Keyword) {
	                switch (token.value) {
	                case 'class':
	                    return parseDeclareClass();
	                case 'function':
	                    return parseDeclareFunction();
	                case 'var':
	                    return parseDeclareVariable();
	                }
	            } else if (token.type === Token.Identifier
	                    && token.value === 'module') {
	                return parseDeclareModule();
	            }
	        }

	        if (lookahead.type !== Token.EOF) {
	            return parseStatement();
	        }
	    }

	    function parseProgramElement() {
	        var isModule = extra.sourceType === 'module' || extra.sourceType === 'nonStrictModule';

	        if (isModule && lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'export':
	                return parseExportDeclaration();
	            case 'import':
	                return parseImportDeclaration();
	            }
	        }

	        return parseSourceElement();
	    }

	    function parseProgramElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted;

	        while (index < length) {
	            token = lookahead;
	            if (token.type !== Token.StringLiteral) {
	                break;
	            }

	            sourceElement = parseProgramElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        while (index < length) {
	            sourceElement = parseProgramElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }
	        return sourceElements;
	    }

	    function parseProgram() {
	        var body, marker = markerCreate();
	        strict = extra.sourceType === 'module';
	        peek();
	        body = parseProgramElements();
	        return markerApply(marker, delegate.createProgram(body));
	    }

	    // 16 JSX

	    XHTMLEntities = {
	        quot: '\u0022',
	        amp: '&',
	        apos: '\u0027',
	        lt: '<',
	        gt: '>',
	        nbsp: '\u00A0',
	        iexcl: '\u00A1',
	        cent: '\u00A2',
	        pound: '\u00A3',
	        curren: '\u00A4',
	        yen: '\u00A5',
	        brvbar: '\u00A6',
	        sect: '\u00A7',
	        uml: '\u00A8',
	        copy: '\u00A9',
	        ordf: '\u00AA',
	        laquo: '\u00AB',
	        not: '\u00AC',
	        shy: '\u00AD',
	        reg: '\u00AE',
	        macr: '\u00AF',
	        deg: '\u00B0',
	        plusmn: '\u00B1',
	        sup2: '\u00B2',
	        sup3: '\u00B3',
	        acute: '\u00B4',
	        micro: '\u00B5',
	        para: '\u00B6',
	        middot: '\u00B7',
	        cedil: '\u00B8',
	        sup1: '\u00B9',
	        ordm: '\u00BA',
	        raquo: '\u00BB',
	        frac14: '\u00BC',
	        frac12: '\u00BD',
	        frac34: '\u00BE',
	        iquest: '\u00BF',
	        Agrave: '\u00C0',
	        Aacute: '\u00C1',
	        Acirc: '\u00C2',
	        Atilde: '\u00C3',
	        Auml: '\u00C4',
	        Aring: '\u00C5',
	        AElig: '\u00C6',
	        Ccedil: '\u00C7',
	        Egrave: '\u00C8',
	        Eacute: '\u00C9',
	        Ecirc: '\u00CA',
	        Euml: '\u00CB',
	        Igrave: '\u00CC',
	        Iacute: '\u00CD',
	        Icirc: '\u00CE',
	        Iuml: '\u00CF',
	        ETH: '\u00D0',
	        Ntilde: '\u00D1',
	        Ograve: '\u00D2',
	        Oacute: '\u00D3',
	        Ocirc: '\u00D4',
	        Otilde: '\u00D5',
	        Ouml: '\u00D6',
	        times: '\u00D7',
	        Oslash: '\u00D8',
	        Ugrave: '\u00D9',
	        Uacute: '\u00DA',
	        Ucirc: '\u00DB',
	        Uuml: '\u00DC',
	        Yacute: '\u00DD',
	        THORN: '\u00DE',
	        szlig: '\u00DF',
	        agrave: '\u00E0',
	        aacute: '\u00E1',
	        acirc: '\u00E2',
	        atilde: '\u00E3',
	        auml: '\u00E4',
	        aring: '\u00E5',
	        aelig: '\u00E6',
	        ccedil: '\u00E7',
	        egrave: '\u00E8',
	        eacute: '\u00E9',
	        ecirc: '\u00EA',
	        euml: '\u00EB',
	        igrave: '\u00EC',
	        iacute: '\u00ED',
	        icirc: '\u00EE',
	        iuml: '\u00EF',
	        eth: '\u00F0',
	        ntilde: '\u00F1',
	        ograve: '\u00F2',
	        oacute: '\u00F3',
	        ocirc: '\u00F4',
	        otilde: '\u00F5',
	        ouml: '\u00F6',
	        divide: '\u00F7',
	        oslash: '\u00F8',
	        ugrave: '\u00F9',
	        uacute: '\u00FA',
	        ucirc: '\u00FB',
	        uuml: '\u00FC',
	        yacute: '\u00FD',
	        thorn: '\u00FE',
	        yuml: '\u00FF',
	        OElig: '\u0152',
	        oelig: '\u0153',
	        Scaron: '\u0160',
	        scaron: '\u0161',
	        Yuml: '\u0178',
	        fnof: '\u0192',
	        circ: '\u02C6',
	        tilde: '\u02DC',
	        Alpha: '\u0391',
	        Beta: '\u0392',
	        Gamma: '\u0393',
	        Delta: '\u0394',
	        Epsilon: '\u0395',
	        Zeta: '\u0396',
	        Eta: '\u0397',
	        Theta: '\u0398',
	        Iota: '\u0399',
	        Kappa: '\u039A',
	        Lambda: '\u039B',
	        Mu: '\u039C',
	        Nu: '\u039D',
	        Xi: '\u039E',
	        Omicron: '\u039F',
	        Pi: '\u03A0',
	        Rho: '\u03A1',
	        Sigma: '\u03A3',
	        Tau: '\u03A4',
	        Upsilon: '\u03A5',
	        Phi: '\u03A6',
	        Chi: '\u03A7',
	        Psi: '\u03A8',
	        Omega: '\u03A9',
	        alpha: '\u03B1',
	        beta: '\u03B2',
	        gamma: '\u03B3',
	        delta: '\u03B4',
	        epsilon: '\u03B5',
	        zeta: '\u03B6',
	        eta: '\u03B7',
	        theta: '\u03B8',
	        iota: '\u03B9',
	        kappa: '\u03BA',
	        lambda: '\u03BB',
	        mu: '\u03BC',
	        nu: '\u03BD',
	        xi: '\u03BE',
	        omicron: '\u03BF',
	        pi: '\u03C0',
	        rho: '\u03C1',
	        sigmaf: '\u03C2',
	        sigma: '\u03C3',
	        tau: '\u03C4',
	        upsilon: '\u03C5',
	        phi: '\u03C6',
	        chi: '\u03C7',
	        psi: '\u03C8',
	        omega: '\u03C9',
	        thetasym: '\u03D1',
	        upsih: '\u03D2',
	        piv: '\u03D6',
	        ensp: '\u2002',
	        emsp: '\u2003',
	        thinsp: '\u2009',
	        zwnj: '\u200C',
	        zwj: '\u200D',
	        lrm: '\u200E',
	        rlm: '\u200F',
	        ndash: '\u2013',
	        mdash: '\u2014',
	        lsquo: '\u2018',
	        rsquo: '\u2019',
	        sbquo: '\u201A',
	        ldquo: '\u201C',
	        rdquo: '\u201D',
	        bdquo: '\u201E',
	        dagger: '\u2020',
	        Dagger: '\u2021',
	        bull: '\u2022',
	        hellip: '\u2026',
	        permil: '\u2030',
	        prime: '\u2032',
	        Prime: '\u2033',
	        lsaquo: '\u2039',
	        rsaquo: '\u203A',
	        oline: '\u203E',
	        frasl: '\u2044',
	        euro: '\u20AC',
	        image: '\u2111',
	        weierp: '\u2118',
	        real: '\u211C',
	        trade: '\u2122',
	        alefsym: '\u2135',
	        larr: '\u2190',
	        uarr: '\u2191',
	        rarr: '\u2192',
	        darr: '\u2193',
	        harr: '\u2194',
	        crarr: '\u21B5',
	        lArr: '\u21D0',
	        uArr: '\u21D1',
	        rArr: '\u21D2',
	        dArr: '\u21D3',
	        hArr: '\u21D4',
	        forall: '\u2200',
	        part: '\u2202',
	        exist: '\u2203',
	        empty: '\u2205',
	        nabla: '\u2207',
	        isin: '\u2208',
	        notin: '\u2209',
	        ni: '\u220B',
	        prod: '\u220F',
	        sum: '\u2211',
	        minus: '\u2212',
	        lowast: '\u2217',
	        radic: '\u221A',
	        prop: '\u221D',
	        infin: '\u221E',
	        ang: '\u2220',
	        and: '\u2227',
	        or: '\u2228',
	        cap: '\u2229',
	        cup: '\u222A',
	        'int': '\u222B',
	        there4: '\u2234',
	        sim: '\u223C',
	        cong: '\u2245',
	        asymp: '\u2248',
	        ne: '\u2260',
	        equiv: '\u2261',
	        le: '\u2264',
	        ge: '\u2265',
	        sub: '\u2282',
	        sup: '\u2283',
	        nsub: '\u2284',
	        sube: '\u2286',
	        supe: '\u2287',
	        oplus: '\u2295',
	        otimes: '\u2297',
	        perp: '\u22A5',
	        sdot: '\u22C5',
	        lceil: '\u2308',
	        rceil: '\u2309',
	        lfloor: '\u230A',
	        rfloor: '\u230B',
	        lang: '\u2329',
	        rang: '\u232A',
	        loz: '\u25CA',
	        spades: '\u2660',
	        clubs: '\u2663',
	        hearts: '\u2665',
	        diams: '\u2666'
	    };

	    function getQualifiedJSXName(object) {
	        if (object.type === Syntax.JSXIdentifier) {
	            return object.name;
	        }
	        if (object.type === Syntax.JSXNamespacedName) {
	            return object.namespace.name + ':' + object.name.name;
	        }
	        /* istanbul ignore else */
	        if (object.type === Syntax.JSXMemberExpression) {
	            return (
	                getQualifiedJSXName(object.object) + '.' +
	                getQualifiedJSXName(object.property)
	            );
	        }
	        /* istanbul ignore next */
	        throwUnexpected(object);
	    }

	    function isJSXIdentifierStart(ch) {
	        // exclude backslash (\)
	        return (ch !== 92) && isIdentifierStart(ch);
	    }

	    function isJSXIdentifierPart(ch) {
	        // exclude backslash (\) and add hyphen (-)
	        return (ch !== 92) && (ch === 45 || isIdentifierPart(ch));
	    }

	    function scanJSXIdentifier() {
	        var ch, start, value = '';

	        start = index;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isJSXIdentifierPart(ch)) {
	                break;
	            }
	            value += source[index++];
	        }

	        return {
	            type: Token.JSXIdentifier,
	            value: value,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanJSXEntity() {
	        var ch, str = '', start = index, count = 0, code;
	        ch = source[index];
	        assert(ch === '&', 'Entity must start with an ampersand');
	        index++;
	        while (index < length && count++ < 10) {
	            ch = source[index++];
	            if (ch === ';') {
	                break;
	            }
	            str += ch;
	        }

	        // Well-formed entity (ending was found).
	        if (ch === ';') {
	            // Numeric entity.
	            if (str[0] === '#') {
	                if (str[1] === 'x') {
	                    code = +('0' + str.substr(1));
	                } else {
	                    // Removing leading zeros in order to avoid treating as octal in old browsers.
	                    code = +str.substr(1).replace(Regex.LeadingZeros, '');
	                }

	                if (!isNaN(code)) {
	                    return String.fromCharCode(code);
	                }
	            /* istanbul ignore else */
	            } else if (XHTMLEntities[str]) {
	                return XHTMLEntities[str];
	            }
	        }

	        // Treat non-entity sequences as regular text.
	        index = start + 1;
	        return '&';
	    }

	    function scanJSXText(stopChars) {
	        var ch, str = '', start;
	        start = index;
	        while (index < length) {
	            ch = source[index];
	            if (stopChars.indexOf(ch) !== -1) {
	                break;
	            }
	            if (ch === '&') {
	                str += scanJSXEntity();
	            } else {
	                index++;
	                if (ch === '\r' && source[index] === '\n') {
	                    str += ch;
	                    ch = source[index];
	                    index++;
	                }
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    ++lineNumber;
	                    lineStart = index;
	                }
	                str += ch;
	            }
	        }
	        return {
	            type: Token.JSXText,
	            value: str,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanJSXStringLiteral() {
	        var innerToken, quote, start;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        innerToken = scanJSXText([quote]);

	        if (quote !== source[index]) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        ++index;

	        innerToken.range = [start, index];

	        return innerToken;
	    }

	    /**
	     * Between JSX opening and closing tags (e.g. <foo>HERE</foo>), anything that
	     * is not another JSX tag and is not an expression wrapped by {} is text.
	     */
	    function advanceJSXChild() {
	        var ch = source.charCodeAt(index);

	        // '<' 60, '>' 62, '{' 123, '}' 125
	        if (ch !== 60 && ch !== 62 && ch !== 123 && ch !== 125) {
	            return scanJSXText(['<', '>', '{', '}']);
	        }

	        return scanPunctuator();
	    }

	    function parseJSXIdentifier() {
	        var token, marker = markerCreate();

	        if (lookahead.type !== Token.JSXIdentifier) {
	            throwUnexpected(lookahead);
	        }

	        token = lex();
	        return markerApply(marker, delegate.createJSXIdentifier(token.value));
	    }

	    function parseJSXNamespacedName() {
	        var namespace, name, marker = markerCreate();

	        namespace = parseJSXIdentifier();
	        expect(':');
	        name = parseJSXIdentifier();

	        return markerApply(marker, delegate.createJSXNamespacedName(namespace, name));
	    }

	    function parseJSXMemberExpression() {
	        var marker = markerCreate(),
	            expr = parseJSXIdentifier();

	        while (match('.')) {
	            lex();
	            expr = markerApply(marker, delegate.createJSXMemberExpression(expr, parseJSXIdentifier()));
	        }

	        return expr;
	    }

	    function parseJSXElementName() {
	        if (lookahead2().value === ':') {
	            return parseJSXNamespacedName();
	        }
	        if (lookahead2().value === '.') {
	            return parseJSXMemberExpression();
	        }

	        return parseJSXIdentifier();
	    }

	    function parseJSXAttributeName() {
	        if (lookahead2().value === ':') {
	            return parseJSXNamespacedName();
	        }

	        return parseJSXIdentifier();
	    }

	    function parseJSXAttributeValue() {
	        var value, marker;
	        if (match('{')) {
	            value = parseJSXExpressionContainer();
	            if (value.expression.type === Syntax.JSXEmptyExpression) {
	                throwError(
	                    value,
	                    'JSX attributes must only be assigned a non-empty ' +
	                        'expression'
	                );
	            }
	        } else if (match('<')) {
	            value = parseJSXElement();
	        } else if (lookahead.type === Token.JSXText) {
	            marker = markerCreate();
	            value = markerApply(marker, delegate.createLiteral(lex()));
	        } else {
	            throwError({}, Messages.InvalidJSXAttributeValue);
	        }
	        return value;
	    }

	    function parseJSXEmptyExpression() {
	        var ch, marker = markerCreatePreserveWhitespace();
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 125) {
	                break;
	            } else if (isLineTerminator(ch)) {
	                if (ch === 13 && source.charCodeAt(index + 1) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	            }
	            ++index;
	        }
	        return markerApply(marker, delegate.createJSXEmptyExpression());
	    }

	    function parseJSXExpressionContainer() {
	        var expression, origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = false;

	        expect('{');

	        if (match('}')) {
	            expression = parseJSXEmptyExpression();
	        } else {
	            expression = parseExpression();
	        }

	        state.inJSXChild = origInJSXChild;
	        state.inJSXTag = origInJSXTag;

	        expect('}');

	        return markerApply(marker, delegate.createJSXExpressionContainer(expression));
	    }

	    function parseJSXSpreadAttribute() {
	        var expression, origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = false;

	        expect('{');
	        expect('...');

	        expression = parseAssignmentExpression();

	        state.inJSXChild = origInJSXChild;
	        state.inJSXTag = origInJSXTag;

	        expect('}');

	        return markerApply(marker, delegate.createJSXSpreadAttribute(expression));
	    }

	    function parseJSXAttribute() {
	        var name, marker;

	        if (match('{')) {
	            return parseJSXSpreadAttribute();
	        }

	        marker = markerCreate();

	        name = parseJSXAttributeName();

	        // HTML empty attribute
	        if (match('=')) {
	            lex();
	            return markerApply(marker, delegate.createJSXAttribute(name, parseJSXAttributeValue()));
	        }

	        return markerApply(marker, delegate.createJSXAttribute(name));
	    }

	    function parseJSXChild() {
	        var token, marker;
	        if (match('{')) {
	            token = parseJSXExpressionContainer();
	        } else if (lookahead.type === Token.JSXText) {
	            marker = markerCreatePreserveWhitespace();
	            token = markerApply(marker, delegate.createLiteral(lex()));
	        } else if (match('<')) {
	            token = parseJSXElement();
	        } else {
	            throwUnexpected(lookahead);
	        }
	        return token;
	    }

	    function parseJSXClosingElement() {
	        var name, origInJSXChild, origInJSXTag, marker = markerCreate();
	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = true;
	        expect('<');
	        expect('/');
	        name = parseJSXElementName();
	        // Because advance() (called by lex() called by expect()) expects there
	        // to be a valid token after >, it needs to know whether to look for a
	        // standard JS token or an JSX text node
	        state.inJSXChild = origInJSXChild;
	        state.inJSXTag = origInJSXTag;
	        expect('>');
	        return markerApply(marker, delegate.createJSXClosingElement(name));
	    }

	    function parseJSXOpeningElement() {
	        var name, attributes = [], selfClosing = false, origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = true;

	        expect('<');

	        name = parseJSXElementName();

	        while (index < length &&
	                lookahead.value !== '/' &&
	                lookahead.value !== '>') {
	            attributes.push(parseJSXAttribute());
	        }

	        state.inJSXTag = origInJSXTag;

	        if (lookahead.value === '/') {
	            expect('/');
	            // Because advance() (called by lex() called by expect()) expects
	            // there to be a valid token after >, it needs to know whether to
	            // look for a standard JS token or an JSX text node
	            state.inJSXChild = origInJSXChild;
	            expect('>');
	            selfClosing = true;
	        } else {
	            state.inJSXChild = true;
	            expect('>');
	        }
	        return markerApply(marker, delegate.createJSXOpeningElement(name, attributes, selfClosing));
	    }

	    function parseJSXElement() {
	        var openingElement, closingElement = null, children = [], origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        openingElement = parseJSXOpeningElement();

	        if (!openingElement.selfClosing) {
	            while (index < length) {
	                state.inJSXChild = false; // Call lookahead2() with inJSXChild = false because </ should not be considered in the child
	                if (lookahead.value === '<' && lookahead2().value === '/') {
	                    break;
	                }
	                state.inJSXChild = true;
	                children.push(parseJSXChild());
	            }
	            state.inJSXChild = origInJSXChild;
	            state.inJSXTag = origInJSXTag;
	            closingElement = parseJSXClosingElement();
	            if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
	                throwError({}, Messages.ExpectedJSXClosingTag, getQualifiedJSXName(openingElement.name));
	            }
	        }

	        // When (erroneously) writing two adjacent tags like
	        //
	        //     var x = <div>one</div><div>two</div>;
	        //
	        // the default error message is a bit incomprehensible. Since it's
	        // rarely (never?) useful to write a less-than sign after an JSX
	        // element, we disallow it here in the parser in order to provide a
	        // better error message. (In the rare case that the less-than operator
	        // was intended, the left tag can be wrapped in parentheses.)
	        if (!origInJSXChild && match('<')) {
	            throwError(lookahead, Messages.AdjacentJSXElements);
	        }

	        return markerApply(marker, delegate.createJSXElement(openingElement, closingElement, children));
	    }

	    function parseTypeAlias() {
	        var id, marker = markerCreate(), typeParameters = null, right;
	        expectContextualKeyword('type');
	        id = parseVariableIdentifier();
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }
	        expect('=');
	        right = parseType();
	        consumeSemicolon();
	        return markerApply(marker, delegate.createTypeAlias(id, typeParameters, right));
	    }

	    function parseInterfaceExtends() {
	        var marker = markerCreate(), id, typeParameters = null;

	        id = parseVariableIdentifier();
	        if (match('<')) {
	            typeParameters = parseTypeParameterInstantiation();
	        }

	        return markerApply(marker, delegate.createInterfaceExtends(
	            id,
	            typeParameters
	        ));
	    }

	    function parseInterfaceish(marker, allowStatic) {
	        var body, bodyMarker, extended = [], id,
	            typeParameters = null;

	        id = parseVariableIdentifier();
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');

	            while (index < length) {
	                extended.push(parseInterfaceExtends());
	                if (!match(',')) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        bodyMarker = markerCreate();
	        body = markerApply(bodyMarker, parseObjectType(allowStatic));

	        return markerApply(marker, delegate.createInterface(
	            id,
	            typeParameters,
	            body,
	            extended
	        ));
	    }

	    function parseInterface() {
	        var marker = markerCreate();

	        if (strict) {
	            expectKeyword('interface');
	        } else {
	            expectContextualKeyword('interface');
	        }

	        return parseInterfaceish(marker, /* allowStatic */false);
	    }

	    function parseDeclareClass() {
	        var marker = markerCreate(), ret;
	        expectContextualKeyword('declare');
	        expectKeyword('class');

	        ret = parseInterfaceish(marker, /* allowStatic */true);
	        ret.type = Syntax.DeclareClass;
	        return ret;
	    }

	    function parseDeclareFunction() {
	        var id, idMarker,
	            marker = markerCreate(), params, returnType, rest, tmp,
	            typeParameters = null, value, valueMarker;

	        expectContextualKeyword('declare');
	        expectKeyword('function');
	        idMarker = markerCreate();
	        id = parseVariableIdentifier();

	        valueMarker = markerCreate();
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }
	        expect('(');
	        tmp = parseFunctionTypeParams();
	        params = tmp.params;
	        rest = tmp.rest;
	        expect(')');

	        expect(':');
	        returnType = parseType();

	        value = markerApply(valueMarker, delegate.createFunctionTypeAnnotation(
	            params,
	            returnType,
	            rest,
	            typeParameters
	        ));

	        id.typeAnnotation = markerApply(valueMarker, delegate.createTypeAnnotation(
	            value
	        ));
	        markerApply(idMarker, id);

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDeclareFunction(
	            id
	        ));
	    }

	    function parseDeclareVariable() {
	        var id, marker = markerCreate();
	        expectContextualKeyword('declare');
	        expectKeyword('var');
	        id = parseTypeAnnotatableIdentifier();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDeclareVariable(
	            id
	        ));
	    }

	    function parseDeclareModule() {
	        var body = [], bodyMarker, id, idMarker, marker = markerCreate(), token;
	        expectContextualKeyword('declare');
	        expectContextualKeyword('module');

	        if (lookahead.type === Token.StringLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            idMarker = markerCreate();
	            id = markerApply(idMarker, delegate.createLiteral(lex()));
	        } else {
	            id = parseVariableIdentifier();
	        }

	        bodyMarker = markerCreate();
	        expect('{');
	        while (index < length && !match('}')) {
	            token = lookahead2();
	            switch (token.value) {
	            case 'class':
	                body.push(parseDeclareClass());
	                break;
	            case 'function':
	                body.push(parseDeclareFunction());
	                break;
	            case 'var':
	                body.push(parseDeclareVariable());
	                break;
	            default:
	                throwUnexpected(lookahead);
	            }
	        }
	        expect('}');

	        return markerApply(marker, delegate.createDeclareModule(
	            id,
	            markerApply(bodyMarker, delegate.createBlockStatement(body))
	        ));
	    }

	    function collectToken() {
	        var loc, token, range, value, entry;

	        /* istanbul ignore else */
	        if (!state.inJSXChild) {
	            skipComment();
	        }

	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        token = extra.advance();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (token.type !== Token.EOF) {
	            range = [token.range[0], token.range[1]];
	            value = source.slice(token.range[0], token.range[1]);
	            entry = {
	                type: TokenName[token.type],
	                value: value,
	                range: range,
	                loc: loc
	            };
	            if (token.regex) {
	                entry.regex = {
	                    pattern: token.regex.pattern,
	                    flags: token.regex.flags
	                };
	            }
	            extra.tokens.push(entry);
	        }

	        return token;
	    }

	    function collectRegex() {
	        var pos, loc, regex, token;

	        skipComment();

	        pos = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        regex = extra.scanRegExp();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (!extra.tokenize) {
	            /* istanbul ignore next */
	            // Pop the previous token, which is likely '/' or '/='
	            if (extra.tokens.length > 0) {
	                token = extra.tokens[extra.tokens.length - 1];
	                if (token.range[0] === pos && token.type === 'Punctuator') {
	                    if (token.value === '/' || token.value === '/=') {
	                        extra.tokens.pop();
	                    }
	                }
	            }

	            extra.tokens.push({
	                type: 'RegularExpression',
	                value: regex.literal,
	                regex: regex.regex,
	                range: [pos, index],
	                loc: loc
	            });
	        }

	        return regex;
	    }

	    function filterTokenLocation() {
	        var i, entry, token, tokens = [];

	        for (i = 0; i < extra.tokens.length; ++i) {
	            entry = extra.tokens[i];
	            token = {
	                type: entry.type,
	                value: entry.value
	            };
	            if (entry.regex) {
	                token.regex = {
	                    pattern: entry.regex.pattern,
	                    flags: entry.regex.flags
	                };
	            }
	            if (extra.range) {
	                token.range = entry.range;
	            }
	            if (extra.loc) {
	                token.loc = entry.loc;
	            }
	            tokens.push(token);
	        }

	        extra.tokens = tokens;
	    }

	    function patch() {
	        if (typeof extra.tokens !== 'undefined') {
	            extra.advance = advance;
	            extra.scanRegExp = scanRegExp;

	            advance = collectToken;
	            scanRegExp = collectRegex;
	        }
	    }

	    function unpatch() {
	        if (typeof extra.scanRegExp === 'function') {
	            advance = extra.advance;
	            scanRegExp = extra.scanRegExp;
	        }
	    }

	    // This is used to modify the delegate.

	    function extend(object, properties) {
	        var entry, result = {};

	        for (entry in object) {
	            /* istanbul ignore else */
	            if (object.hasOwnProperty(entry)) {
	                result[entry] = object[entry];
	            }
	        }

	        for (entry in properties) {
	            /* istanbul ignore else */
	            if (properties.hasOwnProperty(entry)) {
	                result[entry] = properties[entry];
	            }
	        }

	        return result;
	    }

	    function tokenize(code, options) {
	        var toString,
	            token,
	            tokens;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowKeyword: true,
	            allowIn: true,
	            labelSet: new StringMap(),
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1,
	            curlyStack: [],
	            curlyLastIndex: 0
	        };

	        extra = {};

	        // Options matching.
	        options = options || {};

	        // Of course we collect tokens here.
	        options.tokens = true;
	        extra.tokens = [];
	        extra.tokenize = true;
	        // The following two fields are necessary to compute the Regex tokens.
	        extra.openParenToken = -1;
	        extra.openCurlyToken = -1;

	        extra.range = (typeof options.range === 'boolean') && options.range;
	        extra.loc = (typeof options.loc === 'boolean') && options.loc;

	        if (typeof options.comment === 'boolean' && options.comment) {
	            extra.comments = [];
	        }
	        if (typeof options.tolerant === 'boolean' && options.tolerant) {
	            extra.errors = [];
	        }

	        patch();

	        try {
	            peek();
	            if (lookahead.type === Token.EOF) {
	                return extra.tokens;
	            }

	            token = lex();
	            while (lookahead.type !== Token.EOF) {
	                try {
	                    token = lex();
	                } catch (lexError) {
	                    token = lookahead;
	                    if (extra.errors) {
	                        extra.errors.push(lexError);
	                        // We have to break on the first error
	                        // to avoid infinite loops.
	                        break;
	                    } else {
	                        throw lexError;
	                    }
	                }
	            }

	            filterTokenLocation();
	            tokens = extra.tokens;
	            if (typeof extra.comments !== 'undefined') {
	                tokens.comments = extra.comments;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                tokens.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            unpatch();
	            extra = {};
	        }
	        return tokens;
	    }

	    function parse(code, options) {
	        var program, toString;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowKeyword: false,
	            allowIn: true,
	            labelSet: new StringMap(),
	            parenthesizedCount: 0,
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            inJSXChild: false,
	            inJSXTag: false,
	            inType: false,
	            lastCommentStart: -1,
	            yieldAllowed: false,
	            awaitAllowed: false,
	            curlyPosition: 0,
	            curlyStack: [],
	            curlyLastIndex: 0
	        };

	        extra = {};
	        if (typeof options !== 'undefined') {
	            extra.range = (typeof options.range === 'boolean') && options.range;
	            extra.loc = (typeof options.loc === 'boolean') && options.loc;
	            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

	            if (extra.loc && options.source !== null && options.source !== undefined) {
	                delegate = extend(delegate, {
	                    'postProcess': function (node) {
	                        node.loc.source = toString(options.source);
	                        return node;
	                    }
	                });
	            }

	            extra.sourceType = options.sourceType;
	            if (typeof options.tokens === 'boolean' && options.tokens) {
	                extra.tokens = [];
	            }
	            if (typeof options.comment === 'boolean' && options.comment) {
	                extra.comments = [];
	            }
	            if (typeof options.tolerant === 'boolean' && options.tolerant) {
	                extra.errors = [];
	            }
	            if (extra.attachComment) {
	                extra.range = true;
	                extra.comments = [];
	                extra.bottomRightStack = [];
	                extra.trailingComments = [];
	                extra.leadingComments = [];
	            }
	        }

	        patch();
	        try {
	            program = parseProgram();
	            if (typeof extra.comments !== 'undefined') {
	                program.comments = extra.comments;
	            }
	            if (typeof extra.tokens !== 'undefined') {
	                filterTokenLocation();
	                program.tokens = extra.tokens;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                program.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            unpatch();
	            extra = {};
	        }

	        return program;
	    }

	    // Sync with *.json manifests.
	    exports.version = '15001.1.0-dev-harmony-fb';

	    exports.tokenize = tokenize;

	    exports.parse = parse;

	    // Deep copy.
	   /* istanbul ignore next */
	    exports.Syntax = (function () {
	        var name, types = {};

	        if (typeof Object.create === 'function') {
	            types = Object.create(null);
	        }

	        for (name in Syntax) {
	            if (Syntax.hasOwnProperty(name)) {
	                types[name] = Syntax[name];
	            }
	        }

	        if (typeof Object.freeze === 'function') {
	            Object.freeze(types);
	        }

	        return types;
	    }());

	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*jslint vars:false, bitwise:true*/
	/*jshint indent:4*/
	/*global exports:true, define:true*/
	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // and plain browser loading,
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.estraverse = {}));
	    }
	}(this, function clone(exports) {
	    'use strict';

	    var Syntax,
	        isArray,
	        VisitorOption,
	        VisitorKeys,
	        objectCreate,
	        objectKeys,
	        BREAK,
	        SKIP,
	        REMOVE;

	    function ignoreJSHintError() { }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function deepCopy(obj) {
	        var ret = {}, key, val;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                val = obj[key];
	                if (typeof val === 'object' && val !== null) {
	                    ret[key] = deepCopy(val);
	                } else {
	                    ret[key] = val;
	                }
	            }
	        }
	        return ret;
	    }

	    function shallowCopy(obj) {
	        var ret = {}, key;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    ignoreJSHintError(shallowCopy);

	    // based on LLVM libc++ upper_bound / lower_bound
	    // MIT License

	    function upperBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                len = diff;
	            } else {
	                i = current + 1;
	                len -= diff + 1;
	            }
	        }
	        return i;
	    }

	    function lowerBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                i = current + 1;
	                len -= diff + 1;
	            } else {
	                len = diff;
	            }
	        }
	        return i;
	    }
	    ignoreJSHintError(lowerBound);

	    objectCreate = Object.create || (function () {
	        function F() { }

	        return function (o) {
	            F.prototype = o;
	            return new F();
	        };
	    })();

	    objectKeys = Object.keys || function (o) {
	        var keys = [], key;
	        for (key in o) {
	            keys.push(key);
	        }
	        return keys;
	    };

	    function extend(to, from) {
	        var keys = objectKeys(from), key, i, len;
	        for (i = 0, len = keys.length; i < len; i += 1) {
	            key = keys[i];
	            to[key] = from[key];
	        }
	        return to;
	    }

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportBatchSpecifier: 'ExportBatchSpecifier',
	        ExportDeclaration: 'ExportDeclaration',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        ModuleSpecifier: 'ModuleSpecifier',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    VisitorKeys = {
	        AssignmentExpression: ['left', 'right'],
	        ArrayExpression: ['elements'],
	        ArrayPattern: ['elements'],
	        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
	        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
	        BlockStatement: ['body'],
	        BinaryExpression: ['left', 'right'],
	        BreakStatement: ['label'],
	        CallExpression: ['callee', 'arguments'],
	        CatchClause: ['param', 'body'],
	        ClassBody: ['body'],
	        ClassDeclaration: ['id', 'body', 'superClass'],
	        ClassExpression: ['id', 'body', 'superClass'],
	        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: ['test', 'consequent', 'alternate'],
	        ContinueStatement: ['label'],
	        DebuggerStatement: [],
	        DirectiveStatement: [],
	        DoWhileStatement: ['body', 'test'],
	        EmptyStatement: [],
	        ExportBatchSpecifier: [],
	        ExportDeclaration: ['declaration', 'specifiers', 'source'],
	        ExportSpecifier: ['id', 'name'],
	        ExpressionStatement: ['expression'],
	        ForStatement: ['init', 'test', 'update', 'body'],
	        ForInStatement: ['left', 'right', 'body'],
	        ForOfStatement: ['left', 'right', 'body'],
	        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
	        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
	        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        Identifier: [],
	        IfStatement: ['test', 'consequent', 'alternate'],
	        ImportDeclaration: ['specifiers', 'source'],
	        ImportDefaultSpecifier: ['id'],
	        ImportNamespaceSpecifier: ['id'],
	        ImportSpecifier: ['id', 'name'],
	        Literal: [],
	        LabeledStatement: ['label', 'body'],
	        LogicalExpression: ['left', 'right'],
	        MemberExpression: ['object', 'property'],
	        MethodDefinition: ['key', 'value'],
	        ModuleSpecifier: [],
	        NewExpression: ['callee', 'arguments'],
	        ObjectExpression: ['properties'],
	        ObjectPattern: ['properties'],
	        Program: ['body'],
	        Property: ['key', 'value'],
	        ReturnStatement: ['argument'],
	        SequenceExpression: ['expressions'],
	        SpreadElement: ['argument'],
	        SwitchStatement: ['discriminant', 'cases'],
	        SwitchCase: ['test', 'consequent'],
	        TaggedTemplateExpression: ['tag', 'quasi'],
	        TemplateElement: [],
	        TemplateLiteral: ['quasis', 'expressions'],
	        ThisExpression: [],
	        ThrowStatement: ['argument'],
	        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
	        UnaryExpression: ['argument'],
	        UpdateExpression: ['argument'],
	        VariableDeclaration: ['declarations'],
	        VariableDeclarator: ['id', 'init'],
	        WhileStatement: ['test', 'body'],
	        WithStatement: ['object', 'body'],
	        YieldExpression: ['argument']
	    };

	    // unique id
	    BREAK = {};
	    SKIP = {};
	    REMOVE = {};

	    VisitorOption = {
	        Break: BREAK,
	        Skip: SKIP,
	        Remove: REMOVE
	    };

	    function Reference(parent, key) {
	        this.parent = parent;
	        this.key = key;
	    }

	    Reference.prototype.replace = function replace(node) {
	        this.parent[this.key] = node;
	    };

	    Reference.prototype.remove = function remove() {
	        if (isArray(this.parent)) {
	            this.parent.splice(this.key, 1);
	            return true;
	        } else {
	            this.replace(null);
	            return false;
	        }
	    };

	    function Element(node, path, wrap, ref) {
	        this.node = node;
	        this.path = path;
	        this.wrap = wrap;
	        this.ref = ref;
	    }

	    function Controller() { }

	    // API:
	    // return property path array from root to current node
	    Controller.prototype.path = function path() {
	        var i, iz, j, jz, result, element;

	        function addToPath(result, path) {
	            if (isArray(path)) {
	                for (j = 0, jz = path.length; j < jz; ++j) {
	                    result.push(path[j]);
	                }
	            } else {
	                result.push(path);
	            }
	        }

	        // root node
	        if (!this.__current.path) {
	            return null;
	        }

	        // first node is sentinel, second node is root element
	        result = [];
	        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
	            element = this.__leavelist[i];
	            addToPath(result, element.path);
	        }
	        addToPath(result, this.__current.path);
	        return result;
	    };

	    // API:
	    // return type of current node
	    Controller.prototype.type = function () {
	        var node = this.current();
	        return node.type || this.__current.wrap;
	    };

	    // API:
	    // return array of parent elements
	    Controller.prototype.parents = function parents() {
	        var i, iz, result;

	        // first node is sentinel
	        result = [];
	        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
	            result.push(this.__leavelist[i].node);
	        }

	        return result;
	    };

	    // API:
	    // return current node
	    Controller.prototype.current = function current() {
	        return this.__current.node;
	    };

	    Controller.prototype.__execute = function __execute(callback, element) {
	        var previous, result;

	        result = undefined;

	        previous  = this.__current;
	        this.__current = element;
	        this.__state = null;
	        if (callback) {
	            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
	        }
	        this.__current = previous;

	        return result;
	    };

	    // API:
	    // notify control skip / break
	    Controller.prototype.notify = function notify(flag) {
	        this.__state = flag;
	    };

	    // API:
	    // skip child nodes of current node
	    Controller.prototype.skip = function () {
	        this.notify(SKIP);
	    };

	    // API:
	    // break traversals
	    Controller.prototype['break'] = function () {
	        this.notify(BREAK);
	    };

	    // API:
	    // remove node
	    Controller.prototype.remove = function () {
	        this.notify(REMOVE);
	    };

	    Controller.prototype.__initialize = function(root, visitor) {
	        this.visitor = visitor;
	        this.root = root;
	        this.__worklist = [];
	        this.__leavelist = [];
	        this.__current = null;
	        this.__state = null;
	        this.__fallback = visitor.fallback === 'iteration';
	        this.__keys = VisitorKeys;
	        if (visitor.keys) {
	            this.__keys = extend(objectCreate(this.__keys), visitor.keys);
	        }
	    };

	    function isNode(node) {
	        if (node == null) {
	            return false;
	        }
	        return typeof node === 'object' && typeof node.type === 'string';
	    }

	    function isProperty(nodeType, key) {
	        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
	    }

	    Controller.prototype.traverse = function traverse(root, visitor) {
	        var worklist,
	            leavelist,
	            element,
	            node,
	            nodeType,
	            ret,
	            key,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        worklist.push(new Element(root, null, null, null));
	        leavelist.push(new Element(null, null, null, null));

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                ret = this.__execute(visitor.leave, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	                continue;
	            }

	            if (element.node) {

	                ret = this.__execute(visitor.enter, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }

	                worklist.push(sentinel);
	                leavelist.push(element);

	                if (this.__state === SKIP || ret === SKIP) {
	                    continue;
	                }

	                node = element.node;
	                nodeType = element.wrap || node.type;
	                candidates = this.__keys[nodeType];
	                if (!candidates) {
	                    if (this.__fallback) {
	                        candidates = objectKeys(node);
	                    } else {
	                        throw new Error('Unknown node type ' + nodeType + '.');
	                    }
	                }

	                current = candidates.length;
	                while ((current -= 1) >= 0) {
	                    key = candidates[current];
	                    candidate = node[key];
	                    if (!candidate) {
	                        continue;
	                    }

	                    if (isArray(candidate)) {
	                        current2 = candidate.length;
	                        while ((current2 -= 1) >= 0) {
	                            if (!candidate[current2]) {
	                                continue;
	                            }
	                            if (isProperty(nodeType, candidates[current])) {
	                                element = new Element(candidate[current2], [key, current2], 'Property', null);
	                            } else if (isNode(candidate[current2])) {
	                                element = new Element(candidate[current2], [key, current2], null, null);
	                            } else {
	                                continue;
	                            }
	                            worklist.push(element);
	                        }
	                    } else if (isNode(candidate)) {
	                        worklist.push(new Element(candidate, key, null, null));
	                    }
	                }
	            }
	        }
	    };

	    Controller.prototype.replace = function replace(root, visitor) {
	        function removeElem(element) {
	            var i,
	                key,
	                nextElem,
	                parent;

	            if (element.ref.remove()) {
	                // When the reference is an element of an array.
	                key = element.ref.key;
	                parent = element.ref.parent;

	                // If removed from array, then decrease following items' keys.
	                i = worklist.length;
	                while (i--) {
	                    nextElem = worklist[i];
	                    if (nextElem.ref && nextElem.ref.parent === parent) {
	                        if  (nextElem.ref.key < key) {
	                            break;
	                        }
	                        --nextElem.ref.key;
	                    }
	                }
	            }
	        }

	        var worklist,
	            leavelist,
	            node,
	            nodeType,
	            target,
	            element,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel,
	            outer,
	            key;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        outer = {
	            root: root
	        };
	        element = new Element(root, null, null, new Reference(outer, 'root'));
	        worklist.push(element);
	        leavelist.push(element);

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                target = this.__execute(visitor.leave, element);

	                // node may be replaced with null,
	                // so distinguish between undefined and null in this place
	                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                    // replace
	                    element.ref.replace(target);
	                }

	                if (this.__state === REMOVE || target === REMOVE) {
	                    removeElem(element);
	                }

	                if (this.__state === BREAK || target === BREAK) {
	                    return outer.root;
	                }
	                continue;
	            }

	            target = this.__execute(visitor.enter, element);

	            // node may be replaced with null,
	            // so distinguish between undefined and null in this place
	            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                // replace
	                element.ref.replace(target);
	                element.node = target;
	            }

	            if (this.__state === REMOVE || target === REMOVE) {
	                removeElem(element);
	                element.node = null;
	            }

	            if (this.__state === BREAK || target === BREAK) {
	                return outer.root;
	            }

	            // node may be null
	            node = element.node;
	            if (!node) {
	                continue;
	            }

	            worklist.push(sentinel);
	            leavelist.push(element);

	            if (this.__state === SKIP || target === SKIP) {
	                continue;
	            }

	            nodeType = element.wrap || node.type;
	            candidates = this.__keys[nodeType];
	            if (!candidates) {
	                if (this.__fallback) {
	                    candidates = objectKeys(node);
	                } else {
	                    throw new Error('Unknown node type ' + nodeType + '.');
	                }
	            }

	            current = candidates.length;
	            while ((current -= 1) >= 0) {
	                key = candidates[current];
	                candidate = node[key];
	                if (!candidate) {
	                    continue;
	                }

	                if (isArray(candidate)) {
	                    current2 = candidate.length;
	                    while ((current2 -= 1) >= 0) {
	                        if (!candidate[current2]) {
	                            continue;
	                        }
	                        if (isProperty(nodeType, candidates[current])) {
	                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
	                        } else if (isNode(candidate[current2])) {
	                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
	                        } else {
	                            continue;
	                        }
	                        worklist.push(element);
	                    }
	                } else if (isNode(candidate)) {
	                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
	                }
	            }
	        }

	        return outer.root;
	    };

	    function traverse(root, visitor) {
	        var controller = new Controller();
	        return controller.traverse(root, visitor);
	    }

	    function replace(root, visitor) {
	        var controller = new Controller();
	        return controller.replace(root, visitor);
	    }

	    function extendCommentRange(comment, tokens) {
	        var target;

	        target = upperBound(tokens, function search(token) {
	            return token.range[0] > comment.range[0];
	        });

	        comment.extendedRange = [comment.range[0], comment.range[1]];

	        if (target !== tokens.length) {
	            comment.extendedRange[1] = tokens[target].range[0];
	        }

	        target -= 1;
	        if (target >= 0) {
	            comment.extendedRange[0] = tokens[target].range[1];
	        }

	        return comment;
	    }

	    function attachComments(tree, providedComments, tokens) {
	        // At first, we should calculate extended comment ranges.
	        var comments = [], comment, len, i, cursor;

	        if (!tree.range) {
	            throw new Error('attachComments needs range information');
	        }

	        // tokens array is empty, we attach comments to tree as 'leadingComments'
	        if (!tokens.length) {
	            if (providedComments.length) {
	                for (i = 0, len = providedComments.length; i < len; i += 1) {
	                    comment = deepCopy(providedComments[i]);
	                    comment.extendedRange = [0, tree.range[0]];
	                    comments.push(comment);
	                }
	                tree.leadingComments = comments;
	            }
	            return tree;
	        }

	        for (i = 0, len = providedComments.length; i < len; i += 1) {
	            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
	        }

	        // This is based on John Freeman's implementation.
	        cursor = 0;
	        traverse(tree, {
	            enter: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (comment.extendedRange[1] > node.range[0]) {
	                        break;
	                    }

	                    if (comment.extendedRange[1] === node.range[0]) {
	                        if (!node.leadingComments) {
	                            node.leadingComments = [];
	                        }
	                        node.leadingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        cursor = 0;
	        traverse(tree, {
	            leave: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (node.range[1] < comment.extendedRange[0]) {
	                        break;
	                    }

	                    if (node.range[1] === comment.extendedRange[0]) {
	                        if (!node.trailingComments) {
	                            node.trailingComments = [];
	                        }
	                        node.trailingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        return tree;
	    }

	    exports.version = '1.8.1-dev';
	    exports.Syntax = Syntax;
	    exports.traverse = traverse;
	    exports.replace = replace;
	    exports.attachComments = attachComments;
	    exports.VisitorKeys = VisitorKeys;
	    exports.VisitorOption = VisitorOption;
	    exports.Controller = Controller;
	    exports.cloneEnvironment = function () { return clone({}); };

	    return exports;
	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	(function () {
	    'use strict';

	    exports.ast = __webpack_require__(8);
	    exports.code = __webpack_require__(9);
	    exports.keyword = __webpack_require__(1);
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"name": "escodegen-jsx",
		"description": "ECMAScript code generator with JSX",
		"homepage": "http://github.com/ng-vu/escodegen-jsx",
		"main": "escodegen.js",
		"bin": {
			"esgenerate": "./bin/esgenerate.js",
			"escodegen": "./bin/escodegen.js"
		},
		"version": "0.1.0-1.4.2dev",
		"engines": {
			"node": ">=0.10.0"
		},
		"authors": [
			{
				"name": "Vu Nguyen",
				"email": "ng-vu@liti.ws",
				"web": "http://github.com/ng-vu"
			}
		],
		"repository": {
			"type": "git",
			"url": "http://github.com/ng-vu/escodegen-jsx.git"
		},
		"dependencies": {
			"esprima": "^1.2.2",
			"esprima-fb": "^8001.1001.0-dev-harmony-fb",
			"estraverse": "^1.8.0",
			"esutils": "^1.1.6",
			"optionator": "^0.4.0",
			"source-map": "~0.1.40"
		},
		"optionalDependencies": {
			"source-map": "~0.1.40"
		},
		"devDependencies": {
			"esprima-moz": "*",
			"semver": "^4.1.0",
			"bluebird": "^2.3.11",
			"chai": "^1.10.0",
			"gulp-mocha": "^2.0.0",
			"gulp-eslint": "^0.2.0",
			"gulp": "^3.8.10",
			"bower-registry-client": "^0.2.1",
			"commonjs-everywhere": "^0.9.7"
		},
		"licenses": [
			{
				"type": "BSD",
				"url": "http://github.com/ng-vu/escodegen-jsx/raw/master/LICENSE.BSD"
			}
		],
		"scripts": {
			"test": "gulp travis",
			"unit-test": "gulp test",
			"lint": "gulp lint",
			"release": "node tools/release.js",
			"build-min": "cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",
			"build": "cjsify -a path: tools/entry-point.js > escodegen.browser.js"
		},
		"readme": "## Escodegen with JSX\n[![npm version](https://badge.fury.io/js/escodegen.svg)](http://badge.fury.io/js/escodegen)\n[![Build Status](https://secure.travis-ci.org/estools/escodegen.svg)](http://travis-ci.org/estools/escodegen)\n[![Dependency Status](https://david-dm.org/estools/escodegen.svg)](https://david-dm.org/estools/escodegen)\n[![devDependency Status](https://david-dm.org/estools/escodegen/dev-status.svg)](https://david-dm.org/estools/escodegen#info=devDependencies)\n\nEscodegen ([escodegen](http://github.com/estools/escodegen)) is an\n[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)\n(also popularly known as [JavaScript](http://en.wikipedia.org/wiki/JavaScript>JavaScript))\ncode generator from [Mozilla's Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API)\nAST. See the [online generator](https://estools.github.io/escodegen/demo/index.html)\nfor a demo.\n\n**Escodegen-JSX** is a fork of **Escodegen** that implements JSX code generating.\n\n### Features\n- Full support for [JSX syntax extensions](https://github.com/facebook/jsx).\n- Full support for ECMAScript 5.1 ([ECMA-262](http://www.ecma-international.org/publications/standards/Ecma-262.htm))\n- Sensible [syntax tree format](https://github.com/facebook/jsx/blob/master/AST.md) compatible with Mozilla\n[Parser AST](https://developer.mozilla.org/en/SpiderMonkey/Parser_API)\n",
		"readmeFilename": "README.md",
		"bugs": {
			"url": "https://github.com/ng-vu/escodegen-jsx/issues"
		},
		"_id": "escodegen-jsx@0.1.0-1.4.2dev",
		"_shasum": "a6bd3eaea456017187e2be8e18de563c081c837d",
		"_from": "escodegen-jsx@",
		"_resolved": "https://registry.npmjs.org/escodegen-jsx/-/escodegen-jsx-0.1.0-1.4.2dev.tgz"
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(11).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(12).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(13).SourceNode;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    function isExpression(node) {
	        if (node == null) { return false; }
	        switch (node.type) {
	            case 'ArrayExpression':
	            case 'AssignmentExpression':
	            case 'BinaryExpression':
	            case 'CallExpression':
	            case 'ConditionalExpression':
	            case 'FunctionExpression':
	            case 'Identifier':
	            case 'Literal':
	            case 'LogicalExpression':
	            case 'MemberExpression':
	            case 'NewExpression':
	            case 'ObjectExpression':
	            case 'SequenceExpression':
	            case 'ThisExpression':
	            case 'UnaryExpression':
	            case 'UpdateExpression':
	                return true;
	        }
	        return false;
	    }

	    function isIterationStatement(node) {
	        if (node == null) { return false; }
	        switch (node.type) {
	            case 'DoWhileStatement':
	            case 'ForInStatement':
	            case 'ForStatement':
	            case 'WhileStatement':
	                return true;
	        }
	        return false;
	    }

	    function isStatement(node) {
	        if (node == null) { return false; }
	        switch (node.type) {
	            case 'BlockStatement':
	            case 'BreakStatement':
	            case 'ContinueStatement':
	            case 'DebuggerStatement':
	            case 'DoWhileStatement':
	            case 'EmptyStatement':
	            case 'ExpressionStatement':
	            case 'ForInStatement':
	            case 'ForStatement':
	            case 'IfStatement':
	            case 'LabeledStatement':
	            case 'ReturnStatement':
	            case 'SwitchStatement':
	            case 'ThrowStatement':
	            case 'TryStatement':
	            case 'VariableDeclaration':
	            case 'WhileStatement':
	            case 'WithStatement':
	                return true;
	        }
	        return false;
	    }

	    function isSourceElement(node) {
	      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
	    }

	    function trailingStatement(node) {
	        switch (node.type) {
	        case 'IfStatement':
	            if (node.alternate != null) {
	                return node.alternate;
	            }
	            return node.consequent;

	        case 'LabeledStatement':
	        case 'ForStatement':
	        case 'ForInStatement':
	        case 'WhileStatement':
	        case 'WithStatement':
	            return node.body;
	        }
	        return null;
	    }

	    function isProblematicIfStatement(node) {
	        var current;

	        if (node.type !== 'IfStatement') {
	            return false;
	        }
	        if (node.alternate == null) {
	            return false;
	        }
	        current = node.consequent;
	        do {
	            if (current.type === 'IfStatement') {
	                if (current.alternate == null)  {
	                    return true;
	                }
	            }
	            current = trailingStatement(current);
	        } while (current);

	        return false;
	    }

	    module.exports = {
	        isExpression: isExpression,
	        isStatement: isStatement,
	        isIterationStatement: isIterationStatement,
	        isSourceElement: isSourceElement,
	        isProblematicIfStatement: isProblematicIfStatement,

	        trailingStatement: trailingStatement
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    var Regex, NON_ASCII_WHITESPACES;

	    // See `tools/generate-identifier-regex.js`.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
	        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
	    };

	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }

	    function isHexDigit(ch) {
	        return isDecimalDigit(ch) ||    // 0..9
	            (97 <= ch && ch <= 102) ||  // a..f
	            (65 <= ch && ch <= 70);     // A..F
	    }

	    function isOctalDigit(ch) {
	        return (ch >= 48 && ch <= 55);   // 0..7
	    }

	    // 7.2 White Space

	    NON_ASCII_WHITESPACES = [
	        0x1680, 0x180E,
	        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
	        0x202F, 0x205F,
	        0x3000,
	        0xFEFF
	    ];

	    function isWhiteSpace(ch) {
	        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
	            (ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0);
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
	    }

	    // 7.6 Identifier Names and Identifiers

	    function isIdentifierStart(ch) {
	        return (ch >= 97 && ch <= 122) ||     // a..z
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch === 36) || (ch === 95) ||     // $ (dollar) and _ (underscore)
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }

	    function isIdentifierPart(ch) {
	        return (ch >= 97 && ch <= 122) ||     // a..z
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 48 && ch <= 57) ||         // 0..9
	            (ch === 36) || (ch === 95) ||     // $ (dollar) and _ (underscore)
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }

	    module.exports = {
	        isDecimalDigit: isDecimalDigit,
	        isHexDigit: isHexDigit,
	        isOctalDigit: isOctalDigit,
	        isWhiteSpace: isWhiteSpace,
	        isLineTerminator: isLineTerminator,
	        isIdentifierStart: isIdentifierStart,
	        isIdentifierPart: isIdentifierPart
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64VLQ = __webpack_require__(14);
	  var util = __webpack_require__(15);
	  var ArraySet = __webpack_require__(16).ArraySet;
	  var MappingList = __webpack_require__(17).MappingList;

	  /**
	   * An instance of the SourceMapGenerator represents a source map which is
	   * being built incrementally. You may pass an object with the following
	   * properties:
	   *
	   *   - file: The filename of the generated source.
	   *   - sourceRoot: A root for all relative URLs in this source map.
	   */
	  function SourceMapGenerator(aArgs) {
	    if (!aArgs) {
	      aArgs = {};
	    }
	    this._file = util.getArg(aArgs, 'file', null);
	    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	    this._sources = new ArraySet();
	    this._names = new ArraySet();
	    this._mappings = new MappingList();
	    this._sourcesContents = null;
	  }

	  SourceMapGenerator.prototype._version = 3;

	  /**
	   * Creates a new SourceMapGenerator based on a SourceMapConsumer
	   *
	   * @param aSourceMapConsumer The SourceMap.
	   */
	  SourceMapGenerator.fromSourceMap =
	    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	      var sourceRoot = aSourceMapConsumer.sourceRoot;
	      var generator = new SourceMapGenerator({
	        file: aSourceMapConsumer.file,
	        sourceRoot: sourceRoot
	      });
	      aSourceMapConsumer.eachMapping(function (mapping) {
	        var newMapping = {
	          generated: {
	            line: mapping.generatedLine,
	            column: mapping.generatedColumn
	          }
	        };

	        if (mapping.source != null) {
	          newMapping.source = mapping.source;
	          if (sourceRoot != null) {
	            newMapping.source = util.relative(sourceRoot, newMapping.source);
	          }

	          newMapping.original = {
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          };

	          if (mapping.name != null) {
	            newMapping.name = mapping.name;
	          }
	        }

	        generator.addMapping(newMapping);
	      });
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          generator.setSourceContent(sourceFile, content);
	        }
	      });
	      return generator;
	    };

	  /**
	   * Add a single mapping from original source line and column to the generated
	   * source's line and column for this source map being created. The mapping
	   * object should have the following properties:
	   *
	   *   - generated: An object with the generated line and column positions.
	   *   - original: An object with the original line and column positions.
	   *   - source: The original source file (relative to the sourceRoot).
	   *   - name: An optional original token name for this mapping.
	   */
	  SourceMapGenerator.prototype.addMapping =
	    function SourceMapGenerator_addMapping(aArgs) {
	      var generated = util.getArg(aArgs, 'generated');
	      var original = util.getArg(aArgs, 'original', null);
	      var source = util.getArg(aArgs, 'source', null);
	      var name = util.getArg(aArgs, 'name', null);

	      if (!this._skipValidation) {
	        this._validateMapping(generated, original, source, name);
	      }

	      if (source != null && !this._sources.has(source)) {
	        this._sources.add(source);
	      }

	      if (name != null && !this._names.has(name)) {
	        this._names.add(name);
	      }

	      this._mappings.add({
	        generatedLine: generated.line,
	        generatedColumn: generated.column,
	        originalLine: original != null && original.line,
	        originalColumn: original != null && original.column,
	        source: source,
	        name: name
	      });
	    };

	  /**
	   * Set the source content for a source file.
	   */
	  SourceMapGenerator.prototype.setSourceContent =
	    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	      var source = aSourceFile;
	      if (this._sourceRoot != null) {
	        source = util.relative(this._sourceRoot, source);
	      }

	      if (aSourceContent != null) {
	        // Add the source content to the _sourcesContents map.
	        // Create a new _sourcesContents map if the property is null.
	        if (!this._sourcesContents) {
	          this._sourcesContents = {};
	        }
	        this._sourcesContents[util.toSetString(source)] = aSourceContent;
	      } else if (this._sourcesContents) {
	        // Remove the source file from the _sourcesContents map.
	        // If the _sourcesContents map is empty, set the property to null.
	        delete this._sourcesContents[util.toSetString(source)];
	        if (Object.keys(this._sourcesContents).length === 0) {
	          this._sourcesContents = null;
	        }
	      }
	    };

	  /**
	   * Applies the mappings of a sub-source-map for a specific source file to the
	   * source map being generated. Each mapping to the supplied source file is
	   * rewritten using the supplied source map. Note: The resolution for the
	   * resulting mappings is the minimium of this map and the supplied map.
	   *
	   * @param aSourceMapConsumer The source map to be applied.
	   * @param aSourceFile Optional. The filename of the source file.
	   *        If omitted, SourceMapConsumer's file property will be used.
	   * @param aSourceMapPath Optional. The dirname of the path to the source map
	   *        to be applied. If relative, it is relative to the SourceMapConsumer.
	   *        This parameter is needed when the two source maps aren't in the same
	   *        directory, and the source map to be applied contains relative source
	   *        paths. If so, those relative source paths need to be rewritten
	   *        relative to the SourceMapGenerator.
	   */
	  SourceMapGenerator.prototype.applySourceMap =
	    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	      var sourceFile = aSourceFile;
	      // If aSourceFile is omitted, we will use the file property of the SourceMap
	      if (aSourceFile == null) {
	        if (aSourceMapConsumer.file == null) {
	          throw new Error(
	            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	            'or the source map\'s "file" property. Both were omitted.'
	          );
	        }
	        sourceFile = aSourceMapConsumer.file;
	      }
	      var sourceRoot = this._sourceRoot;
	      // Make "sourceFile" relative if an absolute Url is passed.
	      if (sourceRoot != null) {
	        sourceFile = util.relative(sourceRoot, sourceFile);
	      }
	      // Applying the SourceMap can add and remove items from the sources and
	      // the names array.
	      var newSources = new ArraySet();
	      var newNames = new ArraySet();

	      // Find mappings for the "sourceFile"
	      this._mappings.unsortedForEach(function (mapping) {
	        if (mapping.source === sourceFile && mapping.originalLine != null) {
	          // Check if it can be mapped by the source map, then update the mapping.
	          var original = aSourceMapConsumer.originalPositionFor({
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          });
	          if (original.source != null) {
	            // Copy mapping
	            mapping.source = original.source;
	            if (aSourceMapPath != null) {
	              mapping.source = util.join(aSourceMapPath, mapping.source)
	            }
	            if (sourceRoot != null) {
	              mapping.source = util.relative(sourceRoot, mapping.source);
	            }
	            mapping.originalLine = original.line;
	            mapping.originalColumn = original.column;
	            if (original.name != null) {
	              mapping.name = original.name;
	            }
	          }
	        }

	        var source = mapping.source;
	        if (source != null && !newSources.has(source)) {
	          newSources.add(source);
	        }

	        var name = mapping.name;
	        if (name != null && !newNames.has(name)) {
	          newNames.add(name);
	        }

	      }, this);
	      this._sources = newSources;
	      this._names = newNames;

	      // Copy sourcesContents of applied map.
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          if (aSourceMapPath != null) {
	            sourceFile = util.join(aSourceMapPath, sourceFile);
	          }
	          if (sourceRoot != null) {
	            sourceFile = util.relative(sourceRoot, sourceFile);
	          }
	          this.setSourceContent(sourceFile, content);
	        }
	      }, this);
	    };

	  /**
	   * A mapping can have one of the three levels of data:
	   *
	   *   1. Just the generated position.
	   *   2. The Generated position, original position, and original source.
	   *   3. Generated and original position, original source, as well as a name
	   *      token.
	   *
	   * To maintain consistency, we validate that any new mapping being added falls
	   * in to one of these categories.
	   */
	  SourceMapGenerator.prototype._validateMapping =
	    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                                aName) {
	      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	          && aGenerated.line > 0 && aGenerated.column >= 0
	          && !aOriginal && !aSource && !aName) {
	        // Case 1.
	        return;
	      }
	      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	               && aGenerated.line > 0 && aGenerated.column >= 0
	               && aOriginal.line > 0 && aOriginal.column >= 0
	               && aSource) {
	        // Cases 2 and 3.
	        return;
	      }
	      else {
	        throw new Error('Invalid mapping: ' + JSON.stringify({
	          generated: aGenerated,
	          source: aSource,
	          original: aOriginal,
	          name: aName
	        }));
	      }
	    };

	  /**
	   * Serialize the accumulated mappings in to the stream of base 64 VLQs
	   * specified by the source map format.
	   */
	  SourceMapGenerator.prototype._serializeMappings =
	    function SourceMapGenerator_serializeMappings() {
	      var previousGeneratedColumn = 0;
	      var previousGeneratedLine = 1;
	      var previousOriginalColumn = 0;
	      var previousOriginalLine = 0;
	      var previousName = 0;
	      var previousSource = 0;
	      var result = '';
	      var mapping;

	      var mappings = this._mappings.toArray();

	      for (var i = 0, len = mappings.length; i < len; i++) {
	        mapping = mappings[i];

	        if (mapping.generatedLine !== previousGeneratedLine) {
	          previousGeneratedColumn = 0;
	          while (mapping.generatedLine !== previousGeneratedLine) {
	            result += ';';
	            previousGeneratedLine++;
	          }
	        }
	        else {
	          if (i > 0) {
	            if (!util.compareByGeneratedPositions(mapping, mappings[i - 1])) {
	              continue;
	            }
	            result += ',';
	          }
	        }

	        result += base64VLQ.encode(mapping.generatedColumn
	                                   - previousGeneratedColumn);
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (mapping.source != null) {
	          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
	                                     - previousSource);
	          previousSource = this._sources.indexOf(mapping.source);

	          // lines are stored 0-based in SourceMap spec version 3
	          result += base64VLQ.encode(mapping.originalLine - 1
	                                     - previousOriginalLine);
	          previousOriginalLine = mapping.originalLine - 1;

	          result += base64VLQ.encode(mapping.originalColumn
	                                     - previousOriginalColumn);
	          previousOriginalColumn = mapping.originalColumn;

	          if (mapping.name != null) {
	            result += base64VLQ.encode(this._names.indexOf(mapping.name)
	                                       - previousName);
	            previousName = this._names.indexOf(mapping.name);
	          }
	        }
	      }

	      return result;
	    };

	  SourceMapGenerator.prototype._generateSourcesContent =
	    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	      return aSources.map(function (source) {
	        if (!this._sourcesContents) {
	          return null;
	        }
	        if (aSourceRoot != null) {
	          source = util.relative(aSourceRoot, source);
	        }
	        var key = util.toSetString(source);
	        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
	                                                    key)
	          ? this._sourcesContents[key]
	          : null;
	      }, this);
	    };

	  /**
	   * Externalize the source map.
	   */
	  SourceMapGenerator.prototype.toJSON =
	    function SourceMapGenerator_toJSON() {
	      var map = {
	        version: this._version,
	        sources: this._sources.toArray(),
	        names: this._names.toArray(),
	        mappings: this._serializeMappings()
	      };
	      if (this._file != null) {
	        map.file = this._file;
	      }
	      if (this._sourceRoot != null) {
	        map.sourceRoot = this._sourceRoot;
	      }
	      if (this._sourcesContents) {
	        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	      }

	      return map;
	    };

	  /**
	   * Render the source map being generated to a string.
	   */
	  SourceMapGenerator.prototype.toString =
	    function SourceMapGenerator_toString() {
	      return JSON.stringify(this);
	    };

	  exports.SourceMapGenerator = SourceMapGenerator;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(15);
	  var binarySearch = __webpack_require__(18);
	  var ArraySet = __webpack_require__(16).ArraySet;
	  var base64VLQ = __webpack_require__(14);

	  /**
	   * A SourceMapConsumer instance represents a parsed source map which we can
	   * query for information about the original file positions by giving it a file
	   * position in the generated source.
	   *
	   * The only parameter is the raw source map (either as a JSON string, or
	   * already parsed to an object). According to the spec, source maps have the
	   * following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - sources: An array of URLs to the original source files.
	   *   - names: An array of identifiers which can be referrenced by individual mappings.
	   *   - sourceRoot: Optional. The URL root from which all sources are relative.
	   *   - sourcesContent: Optional. An array of contents of the original source files.
	   *   - mappings: A string of base64 VLQs which contain the actual mappings.
	   *   - file: Optional. The generated file this source map is associated with.
	   *
	   * Here is an example source map, taken from the source map spec[0]:
	   *
	   *     {
	   *       version : 3,
	   *       file: "out.js",
	   *       sourceRoot : "",
	   *       sources: ["foo.js", "bar.js"],
	   *       names: ["src", "maps", "are", "fun"],
	   *       mappings: "AA,AB;;ABCDE;"
	   *     }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	   */
	  function SourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sources = util.getArg(sourceMap, 'sources');
	    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	    // requires the array) to play nice here.
	    var names = util.getArg(sourceMap, 'names', []);
	    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	    var mappings = util.getArg(sourceMap, 'mappings');
	    var file = util.getArg(sourceMap, 'file', null);

	    // Once again, Sass deviates from the spec and supplies the version as a
	    // string rather than a number, so we use loose equality checking here.
	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    sources = sources.map(util.normalize);

	    // Pass `true` below to allow duplicate names and sources. While source maps
	    // are intended to be compressed and deduplicated, the TypeScript compiler
	    // sometimes generates source maps with duplicates in them. See Github issue
	    // #72 and bugzil.la/889492.
	    this._names = ArraySet.fromArray(names, true);
	    this._sources = ArraySet.fromArray(sources, true);

	    this.sourceRoot = sourceRoot;
	    this.sourcesContent = sourcesContent;
	    this._mappings = mappings;
	    this.file = file;
	  }

	  /**
	   * Create a SourceMapConsumer from a SourceMapGenerator.
	   *
	   * @param SourceMapGenerator aSourceMap
	   *        The source map that will be consumed.
	   * @returns SourceMapConsumer
	   */
	  SourceMapConsumer.fromSourceMap =
	    function SourceMapConsumer_fromSourceMap(aSourceMap) {
	      var smc = Object.create(SourceMapConsumer.prototype);

	      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	      smc.sourceRoot = aSourceMap._sourceRoot;
	      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                              smc.sourceRoot);
	      smc.file = aSourceMap._file;

	      smc.__generatedMappings = aSourceMap._mappings.toArray().slice();
	      smc.__originalMappings = aSourceMap._mappings.toArray().slice()
	        .sort(util.compareByOriginalPositions);

	      return smc;
	    };

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  SourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      return this._sources.toArray().map(function (s) {
	        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	      }, this);
	    }
	  });

	  // `__generatedMappings` and `__originalMappings` are arrays that hold the
	  // parsed mapping coordinates from the source map's "mappings" attribute. They
	  // are lazily instantiated, accessed via the `_generatedMappings` and
	  // `_originalMappings` getters respectively, and we only parse the mappings
	  // and create these arrays once queried for a source location. We jump through
	  // these hoops because there can be many thousands of mappings, and parsing
	  // them is expensive, so we only want to do it if we must.
	  //
	  // Each object in the arrays is of the form:
	  //
	  //     {
	  //       generatedLine: The line number in the generated code,
	  //       generatedColumn: The column number in the generated code,
	  //       source: The path to the original source file that generated this
	  //               chunk of code,
	  //       originalLine: The line number in the original source that
	  //                     corresponds to this chunk of generated code,
	  //       originalColumn: The column number in the original source that
	  //                       corresponds to this chunk of generated code,
	  //       name: The name of the original symbol which generated this chunk of
	  //             code.
	  //     }
	  //
	  // All properties except for `generatedLine` and `generatedColumn` can be
	  // `null`.
	  //
	  // `_generatedMappings` is ordered by the generated positions.
	  //
	  // `_originalMappings` is ordered by the original positions.

	  SourceMapConsumer.prototype.__generatedMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	    get: function () {
	      if (!this.__generatedMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__generatedMappings;
	    }
	  });

	  SourceMapConsumer.prototype.__originalMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	    get: function () {
	      if (!this.__originalMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__originalMappings;
	    }
	  });

	  SourceMapConsumer.prototype._nextCharIsMappingSeparator =
	    function SourceMapConsumer_nextCharIsMappingSeparator(aStr) {
	      var c = aStr.charAt(0);
	      return c === ";" || c === ",";
	    };

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  SourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      var generatedLine = 1;
	      var previousGeneratedColumn = 0;
	      var previousOriginalLine = 0;
	      var previousOriginalColumn = 0;
	      var previousSource = 0;
	      var previousName = 0;
	      var str = aStr;
	      var temp = {};
	      var mapping;

	      while (str.length > 0) {
	        if (str.charAt(0) === ';') {
	          generatedLine++;
	          str = str.slice(1);
	          previousGeneratedColumn = 0;
	        }
	        else if (str.charAt(0) === ',') {
	          str = str.slice(1);
	        }
	        else {
	          mapping = {};
	          mapping.generatedLine = generatedLine;

	          // Generated column.
	          base64VLQ.decode(str, temp);
	          mapping.generatedColumn = previousGeneratedColumn + temp.value;
	          previousGeneratedColumn = mapping.generatedColumn;
	          str = temp.rest;

	          if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
	            // Original source.
	            base64VLQ.decode(str, temp);
	            mapping.source = this._sources.at(previousSource + temp.value);
	            previousSource += temp.value;
	            str = temp.rest;
	            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
	              throw new Error('Found a source, but no line and column');
	            }

	            // Original line.
	            base64VLQ.decode(str, temp);
	            mapping.originalLine = previousOriginalLine + temp.value;
	            previousOriginalLine = mapping.originalLine;
	            // Lines are stored 0-based
	            mapping.originalLine += 1;
	            str = temp.rest;
	            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
	              throw new Error('Found a source and line, but no column');
	            }

	            // Original column.
	            base64VLQ.decode(str, temp);
	            mapping.originalColumn = previousOriginalColumn + temp.value;
	            previousOriginalColumn = mapping.originalColumn;
	            str = temp.rest;

	            if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
	              // Original name.
	              base64VLQ.decode(str, temp);
	              mapping.name = this._names.at(previousName + temp.value);
	              previousName += temp.value;
	              str = temp.rest;
	            }
	          }

	          this.__generatedMappings.push(mapping);
	          if (typeof mapping.originalLine === 'number') {
	            this.__originalMappings.push(mapping);
	          }
	        }
	      }

	      this.__generatedMappings.sort(util.compareByGeneratedPositions);
	      this.__originalMappings.sort(util.compareByOriginalPositions);
	    };

	  /**
	   * Find the mapping that best matches the hypothetical "needle" mapping that
	   * we are searching for in the given "haystack" of mappings.
	   */
	  SourceMapConsumer.prototype._findMapping =
	    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                           aColumnName, aComparator) {
	      // To return the position we are searching for, we must first find the
	      // mapping for the given position and then return the opposite position it
	      // points to. Because the mappings are sorted, we can use binary search to
	      // find the best mapping.

	      if (aNeedle[aLineName] <= 0) {
	        throw new TypeError('Line must be greater than or equal to 1, got '
	                            + aNeedle[aLineName]);
	      }
	      if (aNeedle[aColumnName] < 0) {
	        throw new TypeError('Column must be greater than or equal to 0, got '
	                            + aNeedle[aColumnName]);
	      }

	      return binarySearch.search(aNeedle, aMappings, aComparator);
	    };

	  /**
	   * Compute the last column for each generated mapping. The last column is
	   * inclusive.
	   */
	  SourceMapConsumer.prototype.computeColumnSpans =
	    function SourceMapConsumer_computeColumnSpans() {
	      for (var index = 0; index < this._generatedMappings.length; ++index) {
	        var mapping = this._generatedMappings[index];

	        // Mappings do not contain a field for the last generated columnt. We
	        // can come up with an optimistic estimate, however, by assuming that
	        // mappings are contiguous (i.e. given two consecutive mappings, the
	        // first mapping ends where the second one starts).
	        if (index + 1 < this._generatedMappings.length) {
	          var nextMapping = this._generatedMappings[index + 1];

	          if (mapping.generatedLine === nextMapping.generatedLine) {
	            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	            continue;
	          }
	        }

	        // The last mapping for each line spans the entire line.
	        mapping.lastGeneratedColumn = Infinity;
	      }
	    };

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  SourceMapConsumer.prototype.originalPositionFor =
	    function SourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      var index = this._findMapping(needle,
	                                    this._generatedMappings,
	                                    "generatedLine",
	                                    "generatedColumn",
	                                    util.compareByGeneratedPositions);

	      if (index >= 0) {
	        var mapping = this._generatedMappings[index];

	        if (mapping.generatedLine === needle.generatedLine) {
	          var source = util.getArg(mapping, 'source', null);
	          if (source != null && this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	          return {
	            source: source,
	            line: util.getArg(mapping, 'originalLine', null),
	            column: util.getArg(mapping, 'originalColumn', null),
	            name: util.getArg(mapping, 'name', null)
	          };
	        }
	      }

	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * availible.
	   */
	  SourceMapConsumer.prototype.sourceContentFor =
	    function SourceMapConsumer_sourceContentFor(aSource) {
	      if (!this.sourcesContent) {
	        return null;
	      }

	      if (this.sourceRoot != null) {
	        aSource = util.relative(this.sourceRoot, aSource);
	      }

	      if (this._sources.has(aSource)) {
	        return this.sourcesContent[this._sources.indexOf(aSource)];
	      }

	      var url;
	      if (this.sourceRoot != null
	          && (url = util.urlParse(this.sourceRoot))) {
	        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	        // many users. We can help them out when they expect file:// URIs to
	        // behave like it would if they were running a local HTTP server. See
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	        if (url.scheme == "file"
	            && this._sources.has(fileUriAbsPath)) {
	          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	        }

	        if ((!url.path || url.path == "/")
	            && this._sources.has("/" + aSource)) {
	          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	        }
	      }

	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.generatedPositionFor =
	    function SourceMapConsumer_generatedPositionFor(aArgs) {
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: util.getArg(aArgs, 'column')
	      };

	      if (this.sourceRoot != null) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var index = this._findMapping(needle,
	                                    this._originalMappings,
	                                    "originalLine",
	                                    "originalColumn",
	                                    util.compareByOriginalPositions);

	      if (index >= 0) {
	        var mapping = this._originalMappings[index];

	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }

	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    };

	  /**
	   * Returns all generated line and column information for the original source
	   * and line provided. The only argument is an object with the following
	   * properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *
	   * and an array of objects is returned, each with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.allGeneratedPositionsFor =
	    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	      // When there is no exact match, SourceMapConsumer.prototype._findMapping
	      // returns the index of the closest mapping less than the needle. By
	      // setting needle.originalColumn to Infinity, we thus find the last
	      // mapping for the given line, provided such a mapping exists.
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: Infinity
	      };

	      if (this.sourceRoot != null) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var mappings = [];

	      var index = this._findMapping(needle,
	                                    this._originalMappings,
	                                    "originalLine",
	                                    "originalColumn",
	                                    util.compareByOriginalPositions);
	      if (index >= 0) {
	        var mapping = this._originalMappings[index];

	        while (mapping && mapping.originalLine === needle.originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[--index];
	        }
	      }

	      return mappings.reverse();
	    };

	  SourceMapConsumer.GENERATED_ORDER = 1;
	  SourceMapConsumer.ORIGINAL_ORDER = 2;

	  /**
	   * Iterate over each mapping between an original source/line/column and a
	   * generated line/column in this source map.
	   *
	   * @param Function aCallback
	   *        The function that is called with each mapping.
	   * @param Object aContext
	   *        Optional. If specified, this object will be the value of `this` every
	   *        time that `aCallback` is called.
	   * @param aOrder
	   *        Either `SourceMapConsumer.GENERATED_ORDER` or
	   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	   *        iterate over the mappings sorted by the generated file's line/column
	   *        order or the original's source/line/column order, respectively. Defaults to
	   *        `SourceMapConsumer.GENERATED_ORDER`.
	   */
	  SourceMapConsumer.prototype.eachMapping =
	    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	      var context = aContext || null;
	      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	      var mappings;
	      switch (order) {
	      case SourceMapConsumer.GENERATED_ORDER:
	        mappings = this._generatedMappings;
	        break;
	      case SourceMapConsumer.ORIGINAL_ORDER:
	        mappings = this._originalMappings;
	        break;
	      default:
	        throw new Error("Unknown order of iteration.");
	      }

	      var sourceRoot = this.sourceRoot;
	      mappings.map(function (mapping) {
	        var source = mapping.source;
	        if (source != null && sourceRoot != null) {
	          source = util.join(sourceRoot, source);
	        }
	        return {
	          source: source,
	          generatedLine: mapping.generatedLine,
	          generatedColumn: mapping.generatedColumn,
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: mapping.name
	        };
	      }).forEach(aCallback, context);
	    };

	  exports.SourceMapConsumer = SourceMapConsumer;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var SourceMapGenerator = __webpack_require__(11).SourceMapGenerator;
	  var util = __webpack_require__(15);

	  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	  // operating systems these days (capturing the result).
	  var REGEX_NEWLINE = /(\r?\n)/;

	  // Newline character code for charCodeAt() comparisons
	  var NEWLINE_CODE = 10;

	  // Private symbol for identifying `SourceNode`s when multiple versions of
	  // the source-map library are loaded. This MUST NOT CHANGE across
	  // versions!
	  var isSourceNode = "$$$isSourceNode$$$";

	  /**
	   * SourceNodes provide a way to abstract over interpolating/concatenating
	   * snippets of generated JavaScript source code while maintaining the line and
	   * column information associated with the original source code.
	   *
	   * @param aLine The original line number.
	   * @param aColumn The original column number.
	   * @param aSource The original source's filename.
	   * @param aChunks Optional. An array of strings which are snippets of
	   *        generated JS, or other SourceNodes.
	   * @param aName The original identifier.
	   */
	  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	    this.children = [];
	    this.sourceContents = {};
	    this.line = aLine == null ? null : aLine;
	    this.column = aColumn == null ? null : aColumn;
	    this.source = aSource == null ? null : aSource;
	    this.name = aName == null ? null : aName;
	    this[isSourceNode] = true;
	    if (aChunks != null) this.add(aChunks);
	  }

	  /**
	   * Creates a SourceNode from generated code and a SourceMapConsumer.
	   *
	   * @param aGeneratedCode The generated code
	   * @param aSourceMapConsumer The SourceMap for the generated code
	   * @param aRelativePath Optional. The path that relative sources in the
	   *        SourceMapConsumer should be relative to.
	   */
	  SourceNode.fromStringWithSourceMap =
	    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	      // The SourceNode we want to fill with the generated code
	      // and the SourceMap
	      var node = new SourceNode();

	      // All even indices of this array are one line of the generated code,
	      // while all odd indices are the newlines between two adjacent lines
	      // (since `REGEX_NEWLINE` captures its match).
	      // Processed fragments are removed from this array, by calling `shiftNextLine`.
	      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	      var shiftNextLine = function() {
	        var lineContents = remainingLines.shift();
	        // The last line of a file might not have a newline.
	        var newLine = remainingLines.shift() || "";
	        return lineContents + newLine;
	      };

	      // We need to remember the position of "remainingLines"
	      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	      // The generate SourceNodes we need a code range.
	      // To extract it current and last mapping is used.
	      // Here we store the last mapping.
	      var lastMapping = null;

	      aSourceMapConsumer.eachMapping(function (mapping) {
	        if (lastMapping !== null) {
	          // We add the code from "lastMapping" to "mapping":
	          // First check if there is a new line in between.
	          if (lastGeneratedLine < mapping.generatedLine) {
	            var code = "";
	            // Associate first line with "lastMapping"
	            addMappingWithCode(lastMapping, shiftNextLine());
	            lastGeneratedLine++;
	            lastGeneratedColumn = 0;
	            // The remaining code is added without mapping
	          } else {
	            // There is no new line in between.
	            // Associate the code between "lastGeneratedColumn" and
	            // "mapping.generatedColumn" with "lastMapping"
	            var nextLine = remainingLines[0];
	            var code = nextLine.substr(0, mapping.generatedColumn -
	                                          lastGeneratedColumn);
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                                lastGeneratedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	            addMappingWithCode(lastMapping, code);
	            // No more remaining code, continue
	            lastMapping = mapping;
	            return;
	          }
	        }
	        // We add the generated code until the first mapping
	        // to the SourceNode without any mapping.
	        // Each line is added as separate string.
	        while (lastGeneratedLine < mapping.generatedLine) {
	          node.add(shiftNextLine());
	          lastGeneratedLine++;
	        }
	        if (lastGeneratedColumn < mapping.generatedColumn) {
	          var nextLine = remainingLines[0];
	          node.add(nextLine.substr(0, mapping.generatedColumn));
	          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	        }
	        lastMapping = mapping;
	      }, this);
	      // We have processed all mappings.
	      if (remainingLines.length > 0) {
	        if (lastMapping) {
	          // Associate the remaining code in the current line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	        }
	        // and add the remaining lines without any mapping
	        node.add(remainingLines.join(""));
	      }

	      // Copy sourcesContent into SourceNode
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          if (aRelativePath != null) {
	            sourceFile = util.join(aRelativePath, sourceFile);
	          }
	          node.setSourceContent(sourceFile, content);
	        }
	      });

	      return node;

	      function addMappingWithCode(mapping, code) {
	        if (mapping === null || mapping.source === undefined) {
	          node.add(code);
	        } else {
	          var source = aRelativePath
	            ? util.join(aRelativePath, mapping.source)
	            : mapping.source;
	          node.add(new SourceNode(mapping.originalLine,
	                                  mapping.originalColumn,
	                                  source,
	                                  code,
	                                  mapping.name));
	        }
	      }
	    };

	  /**
	   * Add a chunk of generated JS to this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.add = function SourceNode_add(aChunk) {
	    if (Array.isArray(aChunk)) {
	      aChunk.forEach(function (chunk) {
	        this.add(chunk);
	      }, this);
	    }
	    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	      if (aChunk) {
	        this.children.push(aChunk);
	      }
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Add a chunk of generated JS to the beginning of this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	    if (Array.isArray(aChunk)) {
	      for (var i = aChunk.length-1; i >= 0; i--) {
	        this.prepend(aChunk[i]);
	      }
	    }
	    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	      this.children.unshift(aChunk);
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Walk over the tree of JS snippets in this node and its children. The
	   * walking function is called once for each snippet of JS and is passed that
	   * snippet and the its original associated source's line/column location.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	    var chunk;
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      chunk = this.children[i];
	      if (chunk[isSourceNode]) {
	        chunk.walk(aFn);
	      }
	      else {
	        if (chunk !== '') {
	          aFn(chunk, { source: this.source,
	                       line: this.line,
	                       column: this.column,
	                       name: this.name });
	        }
	      }
	    }
	  };

	  /**
	   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	   * each of `this.children`.
	   *
	   * @param aSep The separator.
	   */
	  SourceNode.prototype.join = function SourceNode_join(aSep) {
	    var newChildren;
	    var i;
	    var len = this.children.length;
	    if (len > 0) {
	      newChildren = [];
	      for (i = 0; i < len-1; i++) {
	        newChildren.push(this.children[i]);
	        newChildren.push(aSep);
	      }
	      newChildren.push(this.children[i]);
	      this.children = newChildren;
	    }
	    return this;
	  };

	  /**
	   * Call String.prototype.replace on the very right-most source snippet. Useful
	   * for trimming whitespace from the end of a source node, etc.
	   *
	   * @param aPattern The pattern to replace.
	   * @param aReplacement The thing to replace the pattern with.
	   */
	  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	    var lastChild = this.children[this.children.length - 1];
	    if (lastChild[isSourceNode]) {
	      lastChild.replaceRight(aPattern, aReplacement);
	    }
	    else if (typeof lastChild === 'string') {
	      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	    }
	    else {
	      this.children.push(''.replace(aPattern, aReplacement));
	    }
	    return this;
	  };

	  /**
	   * Set the source content for a source file. This will be added to the SourceMapGenerator
	   * in the sourcesContent field.
	   *
	   * @param aSourceFile The filename of the source file
	   * @param aSourceContent The content of the source file
	   */
	  SourceNode.prototype.setSourceContent =
	    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	    };

	  /**
	   * Walk over the tree of SourceNodes. The walking function is called for each
	   * source file content and is passed the filename and source content.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walkSourceContents =
	    function SourceNode_walkSourceContents(aFn) {
	      for (var i = 0, len = this.children.length; i < len; i++) {
	        if (this.children[i][isSourceNode]) {
	          this.children[i].walkSourceContents(aFn);
	        }
	      }

	      var sources = Object.keys(this.sourceContents);
	      for (var i = 0, len = sources.length; i < len; i++) {
	        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	      }
	    };

	  /**
	   * Return the string representation of this source node. Walks over the tree
	   * and concatenates all the various snippets together to one string.
	   */
	  SourceNode.prototype.toString = function SourceNode_toString() {
	    var str = "";
	    this.walk(function (chunk) {
	      str += chunk;
	    });
	    return str;
	  };

	  /**
	   * Returns the string representation of this source node along with a source
	   * map.
	   */
	  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	    var generated = {
	      code: "",
	      line: 1,
	      column: 0
	    };
	    var map = new SourceMapGenerator(aArgs);
	    var sourceMappingActive = false;
	    var lastOriginalSource = null;
	    var lastOriginalLine = null;
	    var lastOriginalColumn = null;
	    var lastOriginalName = null;
	    this.walk(function (chunk, original) {
	      generated.code += chunk;
	      if (original.source !== null
	          && original.line !== null
	          && original.column !== null) {
	        if(lastOriginalSource !== original.source
	           || lastOriginalLine !== original.line
	           || lastOriginalColumn !== original.column
	           || lastOriginalName !== original.name) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	        lastOriginalSource = original.source;
	        lastOriginalLine = original.line;
	        lastOriginalColumn = original.column;
	        lastOriginalName = original.name;
	        sourceMappingActive = true;
	      } else if (sourceMappingActive) {
	        map.addMapping({
	          generated: {
	            line: generated.line,
	            column: generated.column
	          }
	        });
	        lastOriginalSource = null;
	        sourceMappingActive = false;
	      }
	      for (var idx = 0, length = chunk.length; idx < length; idx++) {
	        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	          generated.line++;
	          generated.column = 0;
	          // Mappings end at eol
	          if (idx + 1 === length) {
	            lastOriginalSource = null;
	            sourceMappingActive = false;
	          } else if (sourceMappingActive) {
	            map.addMapping({
	              source: original.source,
	              original: {
	                line: original.line,
	                column: original.column
	              },
	              generated: {
	                line: generated.line,
	                column: generated.column
	              },
	              name: original.name
	            });
	          }
	        } else {
	          generated.column++;
	        }
	      }
	    });
	    this.walkSourceContents(function (sourceFile, sourceContent) {
	      map.setSourceContent(sourceFile, sourceContent);
	    });

	    return { code: generated.code, map: map };
	  };

	  exports.SourceNode = SourceNode;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64 = __webpack_require__(19);

	  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
	  // length quantities we use in the source map spec, the first bit is the sign,
	  // the next four bits are the actual value, and the 6th bit is the
	  // continuation bit. The continuation bit tells us whether there are more
	  // digits in this value following this digit.
	  //
	  //   Continuation
	  //   |    Sign
	  //   |    |
	  //   V    V
	  //   101011

	  var VLQ_BASE_SHIFT = 5;

	  // binary: 100000
	  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	  // binary: 011111
	  var VLQ_BASE_MASK = VLQ_BASE - 1;

	  // binary: 100000
	  var VLQ_CONTINUATION_BIT = VLQ_BASE;

	  /**
	   * Converts from a two-complement value to a value where the sign bit is
	   * placed in the least significant bit.  For example, as decimals:
	   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	   */
	  function toVLQSigned(aValue) {
	    return aValue < 0
	      ? ((-aValue) << 1) + 1
	      : (aValue << 1) + 0;
	  }

	  /**
	   * Converts to a two-complement value from a value where the sign bit is
	   * placed in the least significant bit.  For example, as decimals:
	   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	   */
	  function fromVLQSigned(aValue) {
	    var isNegative = (aValue & 1) === 1;
	    var shifted = aValue >> 1;
	    return isNegative
	      ? -shifted
	      : shifted;
	  }

	  /**
	   * Returns the base 64 VLQ encoded value.
	   */
	  exports.encode = function base64VLQ_encode(aValue) {
	    var encoded = "";
	    var digit;

	    var vlq = toVLQSigned(aValue);

	    do {
	      digit = vlq & VLQ_BASE_MASK;
	      vlq >>>= VLQ_BASE_SHIFT;
	      if (vlq > 0) {
	        // There are still more digits in this value, so we must make sure the
	        // continuation bit is marked.
	        digit |= VLQ_CONTINUATION_BIT;
	      }
	      encoded += base64.encode(digit);
	    } while (vlq > 0);

	    return encoded;
	  };

	  /**
	   * Decodes the next base 64 VLQ value from the given string and returns the
	   * value and the rest of the string via the out parameter.
	   */
	  exports.decode = function base64VLQ_decode(aStr, aOutParam) {
	    var i = 0;
	    var strLen = aStr.length;
	    var result = 0;
	    var shift = 0;
	    var continuation, digit;

	    do {
	      if (i >= strLen) {
	        throw new Error("Expected more digits in base 64 VLQ value.");
	      }
	      digit = base64.decode(aStr.charAt(i++));
	      continuation = !!(digit & VLQ_CONTINUATION_BIT);
	      digit &= VLQ_BASE_MASK;
	      result = result + (digit << shift);
	      shift += VLQ_BASE_SHIFT;
	    } while (continuation);

	    aOutParam.value = fromVLQSigned(result);
	    aOutParam.rest = aStr.slice(i);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * This is a helper function for getting values from parameter/options
	   * objects.
	   *
	   * @param args The object we are extracting values from
	   * @param name The name of the property we are getting.
	   * @param defaultValue An optional value to return if the property is missing
	   * from the object. If this is not specified and the property is missing, an
	   * error will be thrown.
	   */
	  function getArg(aArgs, aName, aDefaultValue) {
	    if (aName in aArgs) {
	      return aArgs[aName];
	    } else if (arguments.length === 3) {
	      return aDefaultValue;
	    } else {
	      throw new Error('"' + aName + '" is a required argument.');
	    }
	  }
	  exports.getArg = getArg;

	  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
	  var dataUrlRegexp = /^data:.+\,.+$/;

	  function urlParse(aUrl) {
	    var match = aUrl.match(urlRegexp);
	    if (!match) {
	      return null;
	    }
	    return {
	      scheme: match[1],
	      auth: match[2],
	      host: match[3],
	      port: match[4],
	      path: match[5]
	    };
	  }
	  exports.urlParse = urlParse;

	  function urlGenerate(aParsedUrl) {
	    var url = '';
	    if (aParsedUrl.scheme) {
	      url += aParsedUrl.scheme + ':';
	    }
	    url += '//';
	    if (aParsedUrl.auth) {
	      url += aParsedUrl.auth + '@';
	    }
	    if (aParsedUrl.host) {
	      url += aParsedUrl.host;
	    }
	    if (aParsedUrl.port) {
	      url += ":" + aParsedUrl.port
	    }
	    if (aParsedUrl.path) {
	      url += aParsedUrl.path;
	    }
	    return url;
	  }
	  exports.urlGenerate = urlGenerate;

	  /**
	   * Normalizes a path, or the path portion of a URL:
	   *
	   * - Replaces consequtive slashes with one slash.
	   * - Removes unnecessary '.' parts.
	   * - Removes unnecessary '<dir>/..' parts.
	   *
	   * Based on code in the Node.js 'path' core module.
	   *
	   * @param aPath The path or url to normalize.
	   */
	  function normalize(aPath) {
	    var path = aPath;
	    var url = urlParse(aPath);
	    if (url) {
	      if (!url.path) {
	        return aPath;
	      }
	      path = url.path;
	    }
	    var isAbsolute = (path.charAt(0) === '/');

	    var parts = path.split(/\/+/);
	    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	      part = parts[i];
	      if (part === '.') {
	        parts.splice(i, 1);
	      } else if (part === '..') {
	        up++;
	      } else if (up > 0) {
	        if (part === '') {
	          // The first part is blank if the path is absolute. Trying to go
	          // above the root is a no-op. Therefore we can remove all '..' parts
	          // directly after the root.
	          parts.splice(i + 1, up);
	          up = 0;
	        } else {
	          parts.splice(i, 2);
	          up--;
	        }
	      }
	    }
	    path = parts.join('/');

	    if (path === '') {
	      path = isAbsolute ? '/' : '.';
	    }

	    if (url) {
	      url.path = path;
	      return urlGenerate(url);
	    }
	    return path;
	  }
	  exports.normalize = normalize;

	  /**
	   * Joins two paths/URLs.
	   *
	   * @param aRoot The root path or URL.
	   * @param aPath The path or URL to be joined with the root.
	   *
	   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	   *   first.
	   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	   *   is updated with the result and aRoot is returned. Otherwise the result
	   *   is returned.
	   *   - If aPath is absolute, the result is aPath.
	   *   - Otherwise the two paths are joined with a slash.
	   * - Joining for example 'http://' and 'www.example.com' is also supported.
	   */
	  function join(aRoot, aPath) {
	    if (aRoot === "") {
	      aRoot = ".";
	    }
	    if (aPath === "") {
	      aPath = ".";
	    }
	    var aPathUrl = urlParse(aPath);
	    var aRootUrl = urlParse(aRoot);
	    if (aRootUrl) {
	      aRoot = aRootUrl.path || '/';
	    }

	    // `join(foo, '//www.example.org')`
	    if (aPathUrl && !aPathUrl.scheme) {
	      if (aRootUrl) {
	        aPathUrl.scheme = aRootUrl.scheme;
	      }
	      return urlGenerate(aPathUrl);
	    }

	    if (aPathUrl || aPath.match(dataUrlRegexp)) {
	      return aPath;
	    }

	    // `join('http://', 'www.example.com')`
	    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	      aRootUrl.host = aPath;
	      return urlGenerate(aRootUrl);
	    }

	    var joined = aPath.charAt(0) === '/'
	      ? aPath
	      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

	    if (aRootUrl) {
	      aRootUrl.path = joined;
	      return urlGenerate(aRootUrl);
	    }
	    return joined;
	  }
	  exports.join = join;

	  /**
	   * Make a path relative to a URL or another path.
	   *
	   * @param aRoot The root path or URL.
	   * @param aPath The path or URL to be made relative to aRoot.
	   */
	  function relative(aRoot, aPath) {
	    if (aRoot === "") {
	      aRoot = ".";
	    }

	    aRoot = aRoot.replace(/\/$/, '');

	    // XXX: It is possible to remove this block, and the tests still pass!
	    var url = urlParse(aRoot);
	    if (aPath.charAt(0) == "/" && url && url.path == "/") {
	      return aPath.slice(1);
	    }

	    return aPath.indexOf(aRoot + '/') === 0
	      ? aPath.substr(aRoot.length + 1)
	      : aPath;
	  }
	  exports.relative = relative;

	  /**
	   * Because behavior goes wacky when you set `__proto__` on objects, we
	   * have to prefix all the strings in our set with an arbitrary character.
	   *
	   * See https://github.com/mozilla/source-map/pull/31 and
	   * https://github.com/mozilla/source-map/issues/30
	   *
	   * @param String aStr
	   */
	  function toSetString(aStr) {
	    return '$' + aStr;
	  }
	  exports.toSetString = toSetString;

	  function fromSetString(aStr) {
	    return aStr.substr(1);
	  }
	  exports.fromSetString = fromSetString;

	  function strcmp(aStr1, aStr2) {
	    var s1 = aStr1 || "";
	    var s2 = aStr2 || "";
	    return (s1 > s2) - (s1 < s2);
	  }

	  /**
	   * Comparator between two mappings where the original positions are compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same original source/line/column, but different generated
	   * line and column the same. Useful when searching for a mapping with a
	   * stubbed out mapping.
	   */
	  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	    var cmp;

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp || onlyCompareOriginal) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.name, mappingB.name);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    return mappingA.generatedColumn - mappingB.generatedColumn;
	  };
	  exports.compareByOriginalPositions = compareByOriginalPositions;

	  /**
	   * Comparator between two mappings where the generated positions are
	   * compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same generated line and column, but different
	   * source/name/original line and column the same. Useful when searching for a
	   * mapping with a stubbed out mapping.
	   */
	  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
	    var cmp;

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	    if (cmp || onlyCompareGenerated) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp) {
	      return cmp;
	    }

	    return strcmp(mappingA.name, mappingB.name);
	  };
	  exports.compareByGeneratedPositions = compareByGeneratedPositions;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(15);

	  /**
	   * A data structure which is a combination of an array and a set. Adding a new
	   * member is O(1), testing for membership is O(1), and finding the index of an
	   * element is O(1). Removing elements from the set is not supported. Only
	   * strings are supported for membership.
	   */
	  function ArraySet() {
	    this._array = [];
	    this._set = {};
	  }

	  /**
	   * Static method for creating ArraySet instances from an existing array.
	   */
	  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	    var set = new ArraySet();
	    for (var i = 0, len = aArray.length; i < len; i++) {
	      set.add(aArray[i], aAllowDuplicates);
	    }
	    return set;
	  };

	  /**
	   * Add the given string to this set.
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	    var isDuplicate = this.has(aStr);
	    var idx = this._array.length;
	    if (!isDuplicate || aAllowDuplicates) {
	      this._array.push(aStr);
	    }
	    if (!isDuplicate) {
	      this._set[util.toSetString(aStr)] = idx;
	    }
	  };

	  /**
	   * Is the given string a member of this set?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.has = function ArraySet_has(aStr) {
	    return Object.prototype.hasOwnProperty.call(this._set,
	                                                util.toSetString(aStr));
	  };

	  /**
	   * What is the index of the given string in the array?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	    if (this.has(aStr)) {
	      return this._set[util.toSetString(aStr)];
	    }
	    throw new Error('"' + aStr + '" is not in the set.');
	  };

	  /**
	   * What is the element at the given index?
	   *
	   * @param Number aIdx
	   */
	  ArraySet.prototype.at = function ArraySet_at(aIdx) {
	    if (aIdx >= 0 && aIdx < this._array.length) {
	      return this._array[aIdx];
	    }
	    throw new Error('No element indexed by ' + aIdx);
	  };

	  /**
	   * Returns the array representation of this set (which has the proper indices
	   * indicated by indexOf). Note that this is a copy of the internal array used
	   * for storing the members so that no one can mess with internal state.
	   */
	  ArraySet.prototype.toArray = function ArraySet_toArray() {
	    return this._array.slice();
	  };

	  exports.ArraySet = ArraySet;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(15);

	  /**
	   * Determine whether mappingB is after mappingA with respect to generated
	   * position.
	   */
	  function generatedPositionAfter(mappingA, mappingB) {
	    // Optimized for most common case
	    var lineA = mappingA.generatedLine;
	    var lineB = mappingB.generatedLine;
	    var columnA = mappingA.generatedColumn;
	    var columnB = mappingB.generatedColumn;
	    return lineB > lineA || lineB == lineA && columnB >= columnA ||
	           util.compareByGeneratedPositions(mappingA, mappingB) <= 0;
	  }

	  /**
	   * A data structure to provide a sorted view of accumulated mappings in a
	   * performance conscious manner. It trades a neglibable overhead in general
	   * case for a large speedup in case of mappings being added in order.
	   */
	  function MappingList() {
	    this._array = [];
	    this._sorted = true;
	    // Serves as infimum
	    this._last = {generatedLine: -1, generatedColumn: 0};
	  }

	  /**
	   * Iterate through internal items. This method takes the same arguments that
	   * `Array.prototype.forEach` takes.
	   *
	   * NOTE: The order of the mappings is NOT guaranteed.
	   */
	  MappingList.prototype.unsortedForEach =
	    function MappingList_forEach(aCallback, aThisArg) {
	      this._array.forEach(aCallback, aThisArg);
	    };

	  /**
	   * Add the given source mapping.
	   *
	   * @param Object aMapping
	   */
	  MappingList.prototype.add = function MappingList_add(aMapping) {
	    var mapping;
	    if (generatedPositionAfter(this._last, aMapping)) {
	      this._last = aMapping;
	      this._array.push(aMapping);
	    } else {
	      this._sorted = false;
	      this._array.push(aMapping);
	    }
	  };

	  /**
	   * Returns the flat, sorted array of mappings. The mappings are sorted by
	   * generated position.
	   *
	   * WARNING: This method returns internal data without copying, for
	   * performance. The return value must NOT be mutated, and should be treated as
	   * an immutable borrow. If you want to take ownership, you must make your own
	   * copy.
	   */
	  MappingList.prototype.toArray = function MappingList_toArray() {
	    if (!this._sorted) {
	      this._array.sort(util.compareByGeneratedPositions);
	      this._sorted = true;
	    }
	    return this._array;
	  };

	  exports.MappingList = MappingList;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * Recursive implementation of binary search.
	   *
	   * @param aLow Indices here and lower do not contain the needle.
	   * @param aHigh Indices here and higher do not contain the needle.
	   * @param aNeedle The element being searched for.
	   * @param aHaystack The non-empty array being searched.
	   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	   */
	  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
	    // This function terminates when one of the following is true:
	    //
	    //   1. We find the exact element we are looking for.
	    //
	    //   2. We did not find the exact element, but we can return the index of
	    //      the next closest element that is less than that element.
	    //
	    //   3. We did not find the exact element, and there is no next-closest
	    //      element which is less than the one we are searching for, so we
	    //      return -1.
	    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	    var cmp = aCompare(aNeedle, aHaystack[mid], true);
	    if (cmp === 0) {
	      // Found the element we are looking for.
	      return mid;
	    }
	    else if (cmp > 0) {
	      // aHaystack[mid] is greater than our needle.
	      if (aHigh - mid > 1) {
	        // The element is in the upper half.
	        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
	      }
	      // We did not find an exact match, return the next closest one
	      // (termination case 2).
	      return mid;
	    }
	    else {
	      // aHaystack[mid] is less than our needle.
	      if (mid - aLow > 1) {
	        // The element is in the lower half.
	        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
	      }
	      // The exact needle element was not found in this haystack. Determine if
	      // we are in termination case (2) or (3) and return the appropriate thing.
	      return aLow < 0 ? -1 : aLow;
	    }
	  }

	  /**
	   * This is an implementation of binary search which will always try and return
	   * the index of next lowest value checked if there is no exact hit. This is
	   * because mappings between original and generated line/col pairs are single
	   * points, and there is an implicit region between each of them, so a miss
	   * just means that you aren't on the very start of a region.
	   *
	   * @param aNeedle The element you are looking for.
	   * @param aHaystack The array that is being searched.
	   * @param aCompare A function which takes the needle and an element in the
	   *     array and returns -1, 0, or 1 depending on whether the needle is less
	   *     than, equal to, or greater than the element, respectively.
	   */
	  exports.search = function search(aNeedle, aHaystack, aCompare) {
	    if (aHaystack.length === 0) {
	      return -1;
	    }
	    return recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var charToIntMap = {};
	  var intToCharMap = {};

	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    .split('')
	    .forEach(function (ch, index) {
	      charToIntMap[ch] = index;
	      intToCharMap[index] = ch;
	    });

	  /**
	   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	   */
	  exports.encode = function base64_encode(aNumber) {
	    if (aNumber in intToCharMap) {
	      return intToCharMap[aNumber];
	    }
	    throw new TypeError("Must be between 0 and 63: " + aNumber);
	  };

	  /**
	   * Decode a single base 64 digit to an integer.
	   */
	  exports.decode = function base64_decode(aChar) {
	    if (aChar in charToIntMap) {
	      return charToIntMap[aChar];
	    }
	    throw new TypeError("Not a valid base 64 digit: " + aChar);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map
