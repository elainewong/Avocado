transporter.module.create('lk_ext/combo_box', function(requires) {

requires('lk_ext/rows_and_columns');

}, function(thisModule) {


thisModule.addSlots(lobby, function(add) {

  add.method('ComboBoxMorph', function ComboBoxMorph() { Class.initializer.apply(this, arguments); }, {category: ['ui']});

});


thisModule.addSlots(ComboBoxMorph, function(add) {

  add.data('superclass', RowMorph);

  add.creator('prototype', Object.create(RowMorph.prototype));

  add.data('type', 'ComboBoxMorph');

  add.method('prompt', function (msg, okButtonText, cancelButtonText, values, defaultValue, onAccept, onCancel) {
    var promptBox = new ColumnMorph();
    promptBox.setFill(Color.blue.lighter().lighter());
    var messageLabel = TextMorph.createLabel(msg);
    var     okButton = ButtonMorph.createButton(    okButtonText, function(evt) { comboBox.relinquishKeyboardFocus(Event.createFake()); promptBox.remove(); if (onAccept) { onAccept(comboBox.value()); } });
    var cancelButton = ButtonMorph.createButton(cancelButtonText, function(evt) { comboBox.relinquishKeyboardFocus(Event.createFake()); promptBox.remove(); if (onCancel) { onCancel();                 } });
    var comboBox = new this(values, defaultValue, function() {okButton.simulatePress(Event.createFake());}, function() {cancelButton.simulatePress(Event.createFake());});
    comboBox.horizontalLayoutMode = LayoutModes.SpaceFill;
    var buttonRow = RowMorph.createSpaceFilling([okButton, Morph.createSpacer(), cancelButton]);
    promptBox.setRows([messageLabel, comboBox, buttonRow]);
    var world = WorldMorph.current();
    world.addMorphAt(promptBox, promptBox.positionToCenterIn(world));
    comboBox.selectAll();
  });

});


thisModule.addSlots(ComboBoxMorph.prototype, function(add) {

  add.data('constructor', ComboBoxMorph);

  add.method('initialize', function ($super, values, defaultValue, onAccept, onCancel) {
    $super();
    this._values = values;
    this._defaultValue = defaultValue;
    this._onAccept = onAccept;
    this._onCancel = onCancel;

    this.closeDnD();
    this.setFill(Color.white);
    this.setBorderWidth(1);
    this.setBorderColor(Color.black);
    
    this._textMorph = new TextMorph(pt(0,0).extent(pt(120,20)), this._defaultValue);
    this._textMorph.suppressHandles = true;
    this._textMorph.setBorderWidth(0);
    this._textMorph.horizontalLayoutMode = LayoutModes.SpaceFill;
    this._textMorph.onKeyDown = function(evt) {
      var c = evt.getKeyCode();
      if (c === Event.KEY_RETURN) {
	this.accept();
	return true;
      }
      if (c === Event.KEY_ESC) {
	this.cancel();
	return true;
      }
      return TextMorph.prototype.onKeyDown.call(this._textMorph, evt);
    }.bind(this);

    var triangle = Morph.makePolygon([pt(-5,0), pt(5,0), pt(0,5)], 1, Color.black, Color.black);
    triangle.suppressHandles = true;
    this._button = ButtonMorph.createButton(triangle, function(evt) {this.toggleMenu();}.bind(this), 5);
    this._button.verticalLayoutMode = LayoutModes.SpaceFill;
    this._button.linkToStyles('comboBoxButton');

    this._menu = new MenuMorph([]);
    this._menu.shouldNotBePartOfRowOrColumn = true;
    this._menu.listStyle = Object.extend(Object.create(this._menu.listStyle), {fillOpacity: 1, borderColor: Color.black, borderRadius: 0});
    this._menu.textStyle = Object.extend(Object.create(this._menu.textStyle), {textColor: this._textMorph.textColor});
    this._menu.estimateListWidth = function(proto) { return this.getExtent().x; }.bind(this);
    this._menu.startOpeningAnimation = function() {
      this.setScalePoint(pt(1, 0.01));
      this.smoothlyScaleVerticallyTo(1);
    };

    values.each(function(v) {this._menu.addItem([v, function() {this.setValue(v);}.bind(this)]);}.bind(this));

    this.setColumns([this._textMorph, Morph.createSpacer(), this._button]);
  }, {category: ['creating']});

  add.data('padding', {left: 1, right: 0, top: 1, bottom: 1, between: 0}, {initializeTo: '{left: 1, right: 1, top: 1, bottom: 1, between: 0}'});

  add.method('value', function () {
    return this._textMorph.getText();
  }, {category: ['value']});

  add.method('setValue', function (v) {
    this._textMorph.setText(v);
    this.hideMenu();
  }, {category: ['value']});

  add.method('accept', function () {
    if (this._onAccept) { this._onAccept(this.value()); }
  }, {category: ['value']});

  add.method('cancel', function () {
    if (this._onCancel) { this._onCancel(); }
  }, {category: ['value']});

  add.method('toggleMenu', function () {
    if (this._menu.owner) { this.hideMenu(); } else { this.showMenu(); }
  }, {category: ['menu']});

  add.method('showMenu', function () {
    // I'd prefer to open the menu directly inside this morph, and leave it open, so that it would
    // move when you move the combo box around. But I don't know how to make the menu stay on
    // top (in z-order) if I do that. -- Adam
    //this._menu.openIn(this, this._textMorph.bounds().bottomLeft(), true);
    this._menu.openIn(this.world(), this.worldPoint(this._textMorph.bounds().bottomLeft()), false);
  }, {category: ['menu']});

  add.method('hideMenu', function () {
    this._menu.smoothlyScaleVerticallyTo(0.01, function() { this._menu.remove(); }.bind(this));
  }, {category: ['menu']});

  add.method('selectAll', function(evt) {
    this._textMorph.requestKeyboardFocus(evt ? evt.hand : WorldMorph.current().firstHand());
    this._textMorph.doSelectAll();
  }, {category: ['keyboard']});

  add.method('relinquishKeyboardFocus', function(evt) {
    this._textMorph.relinquishKeyboardFocus(evt ? evt.hand : WorldMorph.current().firstHand());
  }, {category: ['keyboard']});

});


thisModule.addSlots(DisplayThemes.lively, function(add) {

  add.creator('comboBoxButton', Object.create(DisplayThemes.lively.button));

});


thisModule.addSlots(DisplayThemes.lively.comboBoxButton, function(add) {

  add.data('fill', Color.white, {initializeTo: 'Color.white'});

  add.data('borderRadius', 1);

  add.data('borderWidth', 0);
});


});
