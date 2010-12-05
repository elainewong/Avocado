transporter.module.create('lk_ext/toggler', function(requires) {}, function(thisModule) {


thisModule.addSlots(avocado, function(add) {

  add.creator('toggler', {}, {category: ['ui']});

});


thisModule.addSlots(avocado.toggler, function(add) {

  add.method('create', function (updateFunction, morphToShowOrHide) {
    return Object.newChildOf(this, updateFunction, morphToShowOrHide);
  });

  add.method('initialize', function (morphToUpdate, morphToShowOrHide) {
    this._morphToUpdate = morphToUpdate;
    this._morphToShowOrHide = morphToShowOrHide;
    this._valueHolder = avocado.booleanHolder.containing(false);
    this._valueHolder.addObserver(this.valueChanged.bind(this));
  });

  add.method('toggle', function (evt) { this._valueHolder.toggle(evt); });

  add.method('isOn', function () { return this._valueHolder.getValue(); });

  add.method('setValue', function (b, evt) { this._valueHolder.setValue(b, evt); });

  add.method('beOn', function (evt) { this.setValue(true, evt); });

  add.method('beOff', function (evt) { this.setValue(false, evt); });

  add.method('valueChanged', function (valueHolder, evt) {
    if (this._morphToUpdate) { this._morphToUpdate.updateAppearance(); }
    if (this.isOn()) { this.actualMorphToShow().wasJustShown(evt); }
  });

  add.method('shouldNotBeShown', function () { return ! this.isOn(); });

  add.method('actualMorphToShow', function () {
    var m = this._morphToShowOrHide;
    return typeof(m) === 'function' ? m() : m;
  });

  add.method('constructUIStateMemento', function () {
    return this.isOn();
  }, {category: ['UI state']});

  add.method('assumeUIState', function (uiState, evt) {
    this.setValue(uiState, evt || Event.createFake());
  }, {category: ['UI state']});

  add.method('commandForToggling', function (name, label) {
    var c = avocado.command.create(label || (this.isOn() ? "hide " : "show ") + name, function(evt) { this.toggle(evt); }.bind(this));
    c.setHelpText(function() { return (this.isOn() ? 'Hide ' : 'Show ') + name; }.bind(this));
    return c;
  }, {category: ['commands']});

});


thisModule.addSlots(Morph.prototype, function(add) {

  add.method('wasJustShown', function (evt) { });

});


thisModule.addSlots(TextMorph.prototype, function(add) {

  add.method('wasJustShown', function (evt) { this.requestKeyboardFocus(evt.hand); });

});


});
