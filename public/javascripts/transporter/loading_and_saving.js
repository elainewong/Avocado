transporter.module.create('transporter/loading_and_saving', function(requires) {

}, function(thisModule) {


thisModule.addSlots(transporter, function(add) {

  add.method('fileOut', function (moduleVersion, repo, codeToFileOut, successBlock, failBlock) {
    var m = moduleVersion.module();
    var r = repo || m._repository;
    if (!r) { throw new Error("Don't have a repository for: " + m); }
    r.fileOutModuleVersion(moduleVersion, codeToFileOut.replace(/[\r]/g, "\n"), successBlock, failBlock);
  }, {category: ['saving']});
  
});


thisModule.addSlots(transporter.repositories, function(add) {
  
  add.creator('prompter', {}, {category: ['user interface']});
  
});


thisModule.addSlots(transporter.repositories.prompter, function(add) {
  
  add.method('prompt', function (caption, context, evt, callback) {
    if (transporter.availableRepositories.length === 1) {
      callback(transporter.availableRepositories[0], evt);
    } else {
      var repoCmdList = this.commandListForRepositories(function(repo) { return function() { callback(repo, evt); }});
      avocado.ui.showMenu(repoCmdList, context, caption, evt);
    }
  });

  add.method('commandListForRepositories', function (f) {
    var cmdList = avocado.command.list.create();
    transporter.availableRepositories.each(function(repo) {
      var c = f(repo);
      if (c) {
        cmdList.addItem([repo.toString(), c]);
      }
    });
    return cmdList;
  });
  
});


thisModule.addSlots(transporter.repositories.http, function(add) {

  add.method('menuItemsForLoadMenu', function () {
    return this.menuItemsForLoadMenuForDir(new FileDirectory(new URL(this._url)), "");
  }, {category: ['user interface', 'commands']});

  add.method('menuItemsForLoadMenuForDir', function (dir, pathFromModuleSystemRootDir) {
    var menuItems = [];

    var subdirURLs = this.subdirectoriesIn(dir);
    subdirURLs.each(function(subdirURL) {
      var subdir = new FileDirectory(subdirURL);
      var subdirName = subdirURL.filename().withoutSuffix('/');
      menuItems.push([subdirName, this.menuItemsForLoadMenuForDir(subdir, pathFromModuleSystemRootDir ? pathFromModuleSystemRootDir + "/" + subdirName : subdirName)]);
    }.bind(this));
        
    var jsFileNames = this.filenamesIn(dir).select(function(n) {return n.endsWith(".js");});
    jsFileNames.each(function(n) {
      menuItems.push([n, function(evt) {
        var moduleName = n.substring(0, n.length - 3);
        avocado.ui.showMessageIfErrorDuring(function() {
          this.fileIn(pathFromModuleSystemRootDir ? (pathFromModuleSystemRootDir + '/' + moduleName) : moduleName);
        }.bind(this), evt);
      }.bind(this)]);
    }.bind(this));

    return menuItems;
  }, {category: ['user interface', 'commands']});

  add.method('copyWithSavingScript', function (savingScriptURL) {
    return Object.newChildOf(transporter.repositories.httpWithSavingScript, this.url(), savingScriptURL);
  }, {category: ['copying']});

});


thisModule.addSlots(transporter.repositories.httpWithWebDAV, function(add) {

  add.method('fileOutModuleVersion', function (moduleVersion, codeToFileOut, successBlock, failBlock) {
    var m = moduleVersion.module();
    var url = this.urlForModuleName(m.name());
    var isAsync = true;
    var req = new XMLHttpRequest();
    req.open("PUT", url, isAsync);
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        if (req.status >= 200 && req.status < 300) {
          console.log("Saved " + url);
          successBlock();
        } else {
          failBlock("Failed to file out " + m + ", status is " + req.status + ", statusText is " + req.statusText);
        }
      }
    };
    req.send(codeToFileOut);
  }, {category: ['saving']});

  add.data('canListDirectoryContents', true, {category: ['directories']});

  add.method('subdirectoriesIn', function (dir) {
    return dir.subdirectories();
  }, {category: ['directories']});

  add.method('filenamesIn', function (dir) {
    return dir.filenames();
  }, {category: ['directories']});

});


thisModule.addSlots(transporter.repositories.httpWithSavingScript, function(add) {

  add.method('fileOutModuleVersion', function (moduleVersion, codeToFileOut, successBlock, failBlock) {
    var m = moduleVersion.module();
    var repoURL = this.url();
    if (repoURL.endsWith("/")) { repoURL = repoURL.substring(0, repoURL.length - 1); }
    var url = this._savingScriptURL;
    var postBody = "repoURL=" + encodeURIComponent(repoURL) + "&module=" + encodeURIComponent(m.name()) + "&code=" + encodeURIComponent(codeToFileOut);
    //console.log("About to fileOutModuleVersion " + moduleVersion + " using saving script URL " + url + " and POST body:\n" + postBody);
    var req = new Ajax.Request(url, {
      method: 'post',
      postBody: postBody,
      contentType: 'application/x-www-form-urlencoded',
          
      asynchronous: true,
      onSuccess:   function(transport) { this.onSuccess(m, transport, successBlock); }.bind(this),
      onFailure:   function(t        ) { failBlock("Failed to file out module " + m + " to repository " + this + "; HTTP status code was " + req.getStatus()); }.bind(this),
      onException: function(r,      e) { failBlock("Failed to file out module " + m + " to repository " + this + "; exception was " + e); }.bind(this)
    });
  }, {category: ['saving']});

  add.data('shouldShowNewFileContentsInNewWindow', false, {category: ['downloading']});

  add.method('onSuccess', function (m, transport, callWhenDone) {
    var statusCodeIfAny = parseInt(transport.responseText);
    if (!isNaN(statusCodeIfAny)) {
      avocado.ui.showError("Failed to file out " + m + " module; status code " + statusCodeIfAny);
    } else {
      if (this.shouldShowNewFileContentsInNewWindow) {
        var urlToDownload = transport.responseText;
        window.open(urlToDownload);
      }
      callWhenDone();
    }
  }, {category: ['downloading']});

  add.method('subdirectoriesIn', function (dir) {
    return []; // aaa;
  }, {category: ['directories']});

  add.method('filenamesIn', function (dir) {
    return []; // aaa;
  }, {category: ['directories']});

});


thisModule.addSlots(transporter.repositories.console, function(add) {

  add.method('fileOutModuleVersion', function (moduleVersion, codeToFileOut, successBlock, failBlock) {
    console.log(codeToFileOut);
  });

});


});