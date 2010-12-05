WorldMorph.addMethods({
  onMouseDown: function($super, evt) {
    // Added by Adam, Feb. 2008, because sometimes it's useful
    // to have no keyboard focus (so that, for example, I can
    // hit Cmd-t to open a new tab).
    //
    // NOTE: I once tried making this line say setKeyboardFocus(this),
    // and for some reason Style Editors broke. (They're probably
    // not the only thing that broke, but that was the thing I
    // noticed.) I have no idea why, but it's not important right
    // now, so I'm letting it go. -- Adam, Nov. 2010
    evt.hand.setKeyboardFocus(null);

    if (this.shouldSlideIfClickedAtEdge) { this.slideIfClickedAtEdge(evt); }
    return $super(evt);
  }
});

Object.extend(Morph, {
  suppressAllHandlesForever: function() {
    Object.extend(Morph.prototype, {checkForControlPointNear: function(evt) {return false;}});
  }
});

PasteUpMorph.addMethods({
    onMouseDown: function PasteUpMorph$onMouseDown($super, evt) {  //default behavior is to grab a submorph
        $super(evt);
        var m = this.morphToReceiveEvent(evt, null, true); // Modified to checkForDnD -- Adam, August 2008
        if (Config.usePieMenus) {
                if (m.handlesMouseDown(evt)) return false;
                m.showPieMenu(evt, m);
                return true;
        }
        if (m == null) {
          if (evt.isLeftMouseButtonDown()) { // Added the isLeftMouseButtonDown check, 'cause I like it better that way. -- Adam, Jan. 2009
	    if (! UserAgent.isTouch) { // don't want SelectionMorphs on touch-screens -- Adam
	      this.makeSelection(evt);
	    }
            return true;
          } else {
            return false;
          }
        } else if (!evt.isForContextMenu() && !evt.isForMorphMenu()) { // Changed from a simple isCommandKey check. -- Adam, Jan. 2009
            if (m === this.world()) {
	      if (! UserAgent.isTouch) { // don't want SelectionMorphs on touch-screens -- Adam
                this.makeSelection(evt);
	      }
	      return true;
            } else if (m.handlesMouseDown(evt)) return false;
        }
        evt.hand.grabMorph(m, evt);
        return true;
    },
});

Morph.addMethods({
    checkForDoubleClick: function(evt) {
      var currentTime = new Date().getTime(); // Use evt.timeStamp? I just tried that and it didn't seem to work.
      if (this.timeOfMostRecentDoubleClickCheck != null && currentTime - this.timeOfMostRecentDoubleClickCheck < 400) { // aaa magic number
        this.timeOfMostRecentDoubleClickCheck = null;
        this.onDoubleClick(evt);
        return true;
      } else {
        this.timeOfMostRecentDoubleClickCheck = currentTime;
        return false;
      }
    },

    onDoubleClick: function(evt) {
      if (UserAgent.isTouch) {
        this.showContextMenu(evt);
      }
    }
});

HandMorph.addMethods({
    dropMorphsOn: function(receiver) {
        if (receiver !== this.world()) this.unbundleCarriedSelection();
        if (this.logDnD) console.log("%s dropping %s on %s", this, this.topSubmorph(), receiver);
        this.carriedMorphsDo( function(m) {
            m.dropMeOnMorph(receiver);
            this.showAsUngrabbed(m);
            receiver.justReceivedDrop(m, this); // Added by Adam
        });
        this.removeAllMorphs(); // remove any shadows or halos
    },

    // Copied-and-pasted the bottom half of grabMorph. Needed for
    // stuff that should be able to be explicitly grabbed, but
    // not through the default "just click to pick it up" mechanism. -- Adam
    grabMorphWithoutAskingPermission: function(grabbedMorph, evt) {
        if (this.keyboardFocus && grabbedMorph !== this.keyboardFocus) {
            this.keyboardFocus.relinquishKeyboardFocus(this);
        }
        // console.log('grabbing %s', grabbedMorph);
        // Save info for cancelling grab or drop [also need indexInOwner?]
        // But for now we simply drop on world, so this isn't needed
        this.grabInfo = [grabbedMorph.owner, grabbedMorph.position()];
        if (this.logDnD) console.log('%s grabbing %s', this, grabbedMorph);
        this.addMorphAsGrabbed(grabbedMorph);
        // grabbedMorph.updateOwner();
        this.changed(); //for drop shadow
    },

    grabMorph: function(grabbedMorph, evt) {
      if (!evt) {logStack(); alert("no evt! aaa");}
        if (evt.isShiftDown() || (grabbedMorph.owner && grabbedMorph.owner.copySubmorphsOnGrab == true)) {
            if (!grabbedMorph.okToDuplicate()) return;
            grabbedMorph.copyToHand(this);
            return;
        }
        if (evt.isForMorphMenu()) {
            grabbedMorph.showMorphMenu(evt);
            return;
        }
        if (evt.isForContextMenu()) { // Changed from a simple isCommandKey check. -- Adam, Jan. 2009
            grabbedMorph.showContextMenu(evt);
            return;
        }
        // Give grabbed morph a chance to, eg, spawn a copy or other referent
        grabbedMorph = grabbedMorph.okToBeGrabbedBy(evt);
        if (!grabbedMorph) return;

        if (grabbedMorph.owner && !grabbedMorph.owner.openForDragAndDrop) return;

        if (this.keyboardFocus && grabbedMorph !== this.keyboardFocus) {
            this.keyboardFocus.relinquishKeyboardFocus(this);
        }
        // console.log('grabbing %s', grabbedMorph);
        // Save info for cancelling grab or drop [also need indexInOwner?]
        // But for now we simply drop on world, so this isn't needed
        this.grabInfo = [grabbedMorph.owner, grabbedMorph.position()];
        if (this.logDnD) console.log('%s grabbing %s', this, grabbedMorph);
        this.addMorphAsGrabbed(grabbedMorph);
        // grabbedMorph.updateOwner();
        this.changed(); //for drop shadow
    }
});

TextMorph.addMethods({
  getText: function()  {return this.textString;},
  setText: function(t) {if (this.textString !== t) {this.updateTextString(t); this.layoutChanged(); this.changed();}},

  // Just wondering whether I can set a TextMorph to be bold/italic and have it stay that way no matter what text I give it.
  setEmphasis: function(emph) {
    var txt = new lively.Text.Text(this.textString, this.textStyle);
    txt.emphasize(emph, 0, this.textString.length);
    this.textStyle = txt.style;
    this.composeAfterEdits();
  }
});
    
Class.newInitializer = function(name) {
  // this hack ensures that class instances have a name
  var c = eval(Class.initializerTemplate.replace(/CLASS/g, name) + ";" + name);
  
  // Put it in a category so that it doesn't clutter up the window object. -- Adam
  if (window.avocado && avocado.annotator && name.startsWith('anonymous_')) {
    avocado.annotator.annotationOf(window).setSlotAnnotation(name, {category: ['anonymous classes']});
  }

  return c;
};

Morph.addMethods({
    morphMenu: function(evt) {
        var items = [
            ["remove", this.startZoomingOuttaHere], // so much cooler this way -- Adam
            ["drill", this.showOwnerChain.curry(evt)],
            ["grab", this.pickMeUp.curry(evt)],
            ["drag", this.dragMe.curry(evt)],
            this.isInEditMode() ? ["turn off edit mode", function() { this.switchEditModeOff(); }.bind(this)]
                                : ["turn on edit mode" , function() { this.switchEditModeOn (); }.bind(this)],
            ["edit style", function() { new StylePanel(this).open()}],
            ["inspect", function(evt) { this.world().morphFor(reflect(this)).grabMe(evt); }], // OK, I just couldn't resist. -- Adam
            ["show class in browser", function(evt) { var browser = new SimpleBrowser(this);
                                              browser.openIn(this.world(), evt.point());
                                              browser.getModel().setClassName(this.getType());
            }]
        ];

        if (this.okToDuplicate()) {
            items.unshift(["duplicate", this.copyToHand.curry(evt.hand)]);
        }

        if (this.getModel() instanceof SyntheticModel)
            items.push( ["show Model dump", this.addModelInspector.curry(this)]);

        var menu = new MenuMorph(items, this);
        menu.addLine();
        menu.addItems(this.subMenuItems(evt));
        return menu;
    },
    
    setModel: function(m) {
      this._model = m;
      return this;
    },

  	inspect: function() {
  		try {
        if (this._model && typeof(this._model.inspect) === 'function') { return this._model.inspect(); } // added by Adam
  			return this.toString();
  		} catch (err) {
  			return "#<inspect error: " + err + ">";
  		}
  	},

    toString: function() {
      return ""; // the default behaviour is annoying - makes morph mirrors very wide
    }
});

Morph.addMethods({
  setHelpText: function(t) {
    this.getHelpText = function() { return t; };
    return this;
  }
});


Morph.addMethods({
  isSameTypeAs: function(m) {
    return m && m['__proto__'] === this['__proto__'];
  },
  
  ownerSatisfying: function(condition) {
    if (!this.owner) { return null; }
    if (condition(this.owner)) { return this.owner; }
    return this.owner.ownerSatisfying(condition);
  }
});


Morph.addMethods({
  addMorphCentered: function(m, callWhenDone) {
    this.animatedAddMorphAt(m, this.getExtent().subPt(m.getExtent()).scaleBy(0.5), callWhenDone);
  }
});


Morph.addMethods({
  ownerLocalize: function(pt) {
		if (! this.owner) { return pt; }
    return this.owner.localize(pt);
  }
});


WorldMorph.addMethods({
  ownerLocalize: function(pt) {
		if (pt == null) console.log('null pt in ownerLocalize');   
		return pt.matrixTransform(this.getTransform());
  }
});


ButtonMorph.addMethods({
  pushMe: function() {
    this.getModel().setValue(false);
  }
});


ImageMorph.addMethods({
  beLabel: function() {
    this.applyStyle(this.labelStyle);
    return this;
  },
  
  labelStyle: {
    fill: null,
    suppressGrabbing: true,
    shouldIgnoreEvents: true,
    openForDragAndDrop: false
  }
});

SelectionMorph.addMethods({
  inspect: function () {
    return avocado.command.list.descriptionOfGroup(this.selectedMorphs);
  },

  commands: function () {
    var cmdList = avocado.command.list.create();
    cmdList.addItemsFromGroup(this.selectedMorphs);
    return cmdList;
  }
});

Object.extend(lively.scene.Rectangle.prototype, {
  area: function() { return this.bounds().area(); }
});

Object.extend(lively.paint.Gradient.prototype, {
  // Copied over from Color.
  
	darker: function(recursion) { 
		if (recursion == 0) 
			return this;
		var result = this.mixedWith(Color.black, 0.5);
		return recursion > 1  ? result.darker(recursion - 1) : result;
	},

	lighter: function(recursion) { 
		if (recursion == 0) 
			return this;
		var result = this.mixedWith(Color.white, 0.5);
		return recursion > 1 ? result.lighter(recursion - 1) : result;
	},

	mixedWith: function(color, proportion) {
		var result = this.copyRemoveAll();
		for (var i = 0; i < this.stops.length; ++i) {
			result.addStop(this.stops[i].offset(), this.stops[i].color().mixedWith(color, proportion));
		}
		return result;
	}
});

Object.extend(lively.paint.LinearGradient.prototype, {
    copyRemoveAll: function() {
        return new this.constructor([], this.vector);
    }
});

Object.extend(lively.paint.RadialGradient.prototype, {
    copyRemoveAll: function() {
        return new this.constructor([], this.focus());
    },
    
    focus: function() {
        return pt(this.getTrait('fx'), this.getTrait('fy'));
    }
});
