Morph.addMethods({
  showMorphMenu: function(evt) {
    // Disable the reflective stuff in deployed apps. -- Adam
    var isReflectionEnabled = false;
    WorldMorph.current().applications().each(function(app) { if (app.isReflectionEnabled) { isReflectionEnabled = true; }; });
    if (!isReflectionEnabled) { return; }

    var menu = this.morphMenu(evt);
    menu.openIn(this.world(), evt.point(), false, Object.inspect(this).truncate());
  },

  showContextMenu: function(evt) {
    var menu = this.contextMenu(evt);
    if (!menu) { return; }
    var baseColor = Color.black; // should be a clear difference between a morph menu and a context menu
    menu.listStyle = Object.create(menu.listStyle);
    menu.textStyle = Object.create(menu.textStyle);
    menu.listStyle.borderColor = baseColor;
    menu.listStyle.fill        = baseColor.lighter(5);
    menu.textStyle.textColor   = baseColor;
    menu.openIn(this.world(), evt.point(), false, Object.inspect(this).truncate());
  },

  contextMenu: function (evt) {
    var cs = this.commands();
    if (!cs) { return null; }
    var menu = new MenuMorph([], this);
    cs.addItemsToMenu(menu, this);
    return menu;
  },

  commands: function () {
    if (! this.addCommandsTo) { return null; }
    var cmdList = command.list.create();
    this.addCommandsTo(cmdList);
    if (cmdList.size() === 0) { return null; }
    return cmdList;
  }
});

Event.addMethods({
  isForContextMenu:    function() { return this.isCtrlDown()   || this.isRightMouseButtonDown();  },
  isForMorphMenu:      function() { return this.isCommandKey() || this.isMiddleMouseButtonDown(); }
});

MenuMorph.addMethods({
  addSection: function(newItems) {
    if (newItems.size() > 0) {
      if (this.items.size() > 0) {this.addLine();}
      newItems.each(function(item) {this.addItem(item);}.bind(this));
    }
  }
});
