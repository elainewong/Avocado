transporter.module.create('programming_environment/pretty_printer', function(requires) {

requires('narcissus/jsparse');
requires('core/lk_TestFramework');
requires('reflection/mirror');

}, function(thisModule) {


thisModule.addSlots(avocado, function(add) {

  add.creator('prettyPrinter', {}, {category: ['manipulating code'], comment: 'Not usable yet. Just an experiment I was trying. -- Adam'});

});


thisModule.addSlots(avocado.prettyPrinter, function(add) {

  add.method('create', function(node, options) {
    return Object.newChildOf(this, node, options);
  }, {category: ['creating']});
  
  add.method('initialize', function(node, options) {
    this._rootNode = node;
    this._buffer = avocado.stringBuffer.create();
    this._indentationLevel = options.indentationLevel || 0;
    this._spacesPerIndent = 2;
    this.prettyPrint(node);
  }, {category: ['creating']});

  add.creator('tests', Object.create(TestCase.prototype), {category: ['tests']});
  
  add.method('result', function() {
    return this._buffer.toString();
  }, {category: ['accessing']});
  
  add.method('prettyPrint', function(node) {
    var i;
    // console.log("prettyPrint encountered node type: " + tokens[node.type]);
    switch(node.type) {
    case SCRIPT:
      for (i = 0; i < node.length; ++i) {
        if (i > 0) { this.newLine(); }
        this.prettyPrint(node[i]);
      }
      break;
    case BLOCK:
      this._buffer.append("{");
      if (node.length === 0) {
      } else if (node.length === 1) {
        this._buffer.append(" ");
        this.prettyPrint(node[0]);
        this._buffer.append(" ");
      } else {
        this.indent();
        this.newLine();
        for (i = 0; i < node.length; ++i) {
          this.prettyPrint(node[i]);
          if (i === node.length - 1) { this.unindent(); }
          this.newLine();
        }
      }
      this._buffer.append("}");
      break;
    case VAR:
      this._buffer.append("var ");
      for (i = 0; i < node.length; ++i) {
        if (i > 0) { this._buffer.append(", "); }
        this.prettyPrint(node[i]);
      }
      this._buffer.append(";");
      break;
    case SEMICOLON:
      this.prettyPrint(node.expression);
      this._buffer.append(";");
      break;
    case IDENTIFIER:
      this._buffer.append(node.value);
      if (node.initializer) {
        this._buffer.append(" = ");
        this.prettyPrint(node.initializer);
      }
      break;
    case THIS:
    case NULL:
    //case UNDEFINED:
    case TRUE:
    case FALSE:
    case NUMBER:
      this._buffer.append(node.value);
      break;
    case STRING:
      var rightKindOfQuote = node.tokenizer.source[node.start];
      this._buffer.append(rightKindOfQuote).append(node.value).append(rightKindOfQuote);
      break;
    case OBJECT_INIT:
      this._buffer.append("{");
      for (i = 0; i < node.length; ++i) {
        if (i > 0) { this._buffer.append(", "); }
        this.prettyPrint(node[i]);
      }
      this._buffer.append("}");
      break;
    case PROPERTY_INIT:
      this.prettyPrint(node[0]);
      this._buffer.append(": ");
      this.prettyPrint(node[1]);
      break;
    case ARRAY_INIT:
      this._buffer.append("[");
      for (i = 0; i < node.length; ++i) {
        if (i > 0) { this._buffer.append(", "); }
        this.prettyPrint(node[i]);
      }
      this._buffer.append("]");
      break;
    case ASSIGN:
      this.prettyPrint(node[0]);
      this._buffer.append(" = ");
      this.prettyPrint(node[1]);
      break;
    case GROUP:
      if (node.value !== '(') { throw new Error("aaa, group but not open-paren?"); }
      this._buffer.append("(");
      if (node.length !== 1) { throw new Error("aaa, group but not just one member?"); }
      this.prettyPrint(node[0]);
      this._buffer.append(")");
      break;
    case CALL:
      this.prettyPrint(node[0]);
      this._buffer.append("(");
      this.prettyPrint(node[1]);
      this._buffer.append(")");
      break;
    case NEW_WITH_ARGS:
    this._buffer.append("new ");
      this.prettyPrint(node[0]);
      this._buffer.append("(");
      this.prettyPrint(node[1]);
      this._buffer.append(")");
      break;
    case DOT:
      this.prettyPrint(node[0]);
      this._buffer.append(".");
      this.prettyPrint(node[1]);
      break;
    case LIST:
      for (i = 0; i < node.length; ++i) {
        if (i > 0) { this._buffer.append(", "); }
        this.prettyPrint(node[i]);
      }
      break;
    case FUNCTION:
      if (node.functionForm === EXPRESSED_FORM) {
        this._buffer.append("function (");
        for (i = 0; i < node.params.length; ++i) {
          if (i > 0) { this._buffer.append(", "); }
          this._buffer.append(node.params[i]);
        }
        this._buffer.append(") {");
        switch (node.body.length) {
        case 0:
          this.prettyPrint(node.body);
          break;
        case 1:
          this._buffer.append(" ");
          this.prettyPrint(node.body);
          this._buffer.append(" ");
          break;
        default:
          this.indentDuring(function() {
            this.newLine();
            this.prettyPrint(node.body);
          }.bind(this));
          this.newLine();
        }
        this._buffer.append("}");
        break;
      }
      reflect(node).morph().grabMe();
      throw new Error("prettyPrinter encountered unknown FUNCTION type: " + tokens[node.type]);
    case IF:
      this._buffer.append("if (");
      this.prettyPrint(node.condition);
      this._buffer.append(") ");
      this.prettyPrint(node.thenPart);
      if (node.elsePart) {
        this._buffer.append(" else ");
        this.prettyPrint(node.elsePart);
      }
      break;
    case FOR:
      this._buffer.append("for (");
      this.prettyPrint(node.setup);
      // hack - sometimes the setup is an expression, sometimes it's a var statement; is there a clean way to do this? -- Adam
      if (node.setup.type !== VAR) { this._buffer.append(";"); }
      this._buffer.append(" ");
      this.prettyPrint(node.condition);
      this._buffer.append("; ");
      this.prettyPrint(node.update);
      this._buffer.append(") ");
      this.prettyPrint(node.body);
      break;
    case RETURN:
      if (typeof(node.value) === 'object') {
        this._buffer.append("return ");
        this.prettyPrint(node.value);
        this._buffer.append(";");
      } else {
        this._buffer.append("return;");
      }
      break;
    case THROW:
      this._buffer.append("throw ");
      this.prettyPrint(node.exception);
      this._buffer.append(";");
      break;
    case NOT:
      this._buffer.append("!");
      this.prettyPrint(node[0]);
      break;
    case INCREMENT:
    case DECREMENT:
      if (node.postfix) {
        this.prettyPrint(node[0]);
        this._buffer.append(node.value);
      } else {
        this._buffer.append(node.value);
        this.prettyPrint(node[0]);
      }
      break;
    case OR:
    case AND:
    case BITWISE_OR:
    case BITWISE_XOR:
    case BITWISE_AND:
    case EQ: case NE: case STRICT_EQ: case STRICT_NE:
    case LT: case LE: case GE: case GT:
    case INSTANCEOF:
    case LSH: case RSH: case URSH:
    case PLUS: case MINUS:
    case MUL: case DIV: case MOD:
      this.prettyPrint(node[0]);
      this._buffer.append(" ").append(node.value).append(" ");
      this.prettyPrint(node[1]);
      break;
    case HOOK:
      this.prettyPrint(node[0]);
      this._buffer.append(" ? ");
      this.prettyPrint(node[1]);
      this._buffer.append(" : ");
      this.prettyPrint(node[2]);
      break;
    default:
      reflect(node).morph().grabMe();
      var errorMsg = "prettyPrinter encountered unknown node type: " + tokens[node.type];
      console.log(errorMsg);
      throw new Error(errorMsg);
    }
  }, {category: ['formatting']});
  
  add.method('newLine', function() {
    this._buffer.append("\n");
    for (var i = 0; i < this._indentationLevel; ++i) { this._buffer.append(" "); }
  }, {category: ['formatting']});
  
  add.method('indentDuring', function(f) {
    this.indent();
    try {
      return f();
    } finally {
      this.unindent();
    }
  }, {category: ['formatting']});
  
  add.method('indent', function(f) {
    this._indentationLevel += this._spacesPerIndent;
  }, {category: ['formatting']});
  
  add.method('unindent', function(f) {
    this._indentationLevel -= this._spacesPerIndent;
  }, {category: ['formatting']});

});


thisModule.addSlots(mirror, function(add) {

  add.method('prettyPrint', function(options) {
    var expr = this.expressionEvaluatingToMe(true);
    var stmt = avocado.stringBuffer.create('var ___contents___ = (').append(expr).append(');').toString();
    // need the assignment and the semicolon so that the parser doesn't gripe about not having a function name
    var rootNode = parse(stmt);
    var contentsNode = rootNode[0][0].initializer[0]; // bypass the nodes for the __contents__ statement
    return avocado.prettyPrinter.create(contentsNode, options).result();
  });
  
});


thisModule.addSlots(avocado.prettyPrinter.tests, function(add) {

  add.method('functionToFormat1', function () {
    var nothing = function () {};
    var f = function (a) { return a + 4; };
    callAFunction(f, 42);
    var obj = {a: 4, b: 5};
    obj.a;
    f.callAMethod(3, obj);
  });
  
  add.method('functionToFormat2', function () {
    f = this;
    var arr = obj.a < 3 ? [1, 2, 'three'] : null;
    if (true) {
      lalala();
      return;
    }
    if (false) { bleh(); } else { blah(); }
    // can this thing do comments?
    for (var i = 0; i < n; i++) {
      throw new Error("blah blah");
      ++i;
      --i;
      i--;
    }
    for (i = 0; i < n; i++) { something(); }
    return 'lalala';
  });
  
  add.method('checkFunction', function (f) {
    // Gotta start with indentationLevel 2 because that's how we write all the
    // code in the source files here. -- Adam
    this.assertEqual(f.toString(), reflect(f).prettyPrint({indentationLevel: 2}));
  });
  
  add.method('test1', function () {
    this.checkFunction(this.functionToFormat1);
  });
  
  add.method('test2', function () {
    this.checkFunction(this.functionToFormat2);
  });
  
});


});