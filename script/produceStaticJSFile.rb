#!/usr/bin/ruby

Dir.chdir('public/javascripts')

def preamble
  puts("if (! window.hasOwnProperty('avocado')) { window.avocado = {}; }")
  puts("avocado.isLoadingStatically = true;")
  puts
end

def postscript
end

def newModule(name)
  puts("transporter.module.onLoadCallbacks[#{name.inspect}] = function() {};") unless name == 'bootstrap'
  puts(File.read("#{name}.js"))
  puts
end

def externalScript(name)
  puts("transporter.module.onLoadCallbacks[#{name.inspect}] = function() {};")
  puts(File.read("#{name}.js"))
  puts("transporter.module.onLoadCallbacks[#{name.inspect}] = 'done';")
  puts
end

def doIt(code)
  puts(code)
end

preamble();

# This code produced from bootstrap.js; search for shouldPrintLoadOrder.

newModule('bootstrap');
newModule('bootstrap_lk');
doIt('transporter.initializeCallbackWaiters();');
doIt('transporter.initializeRepositories();');
externalScript('prototype/prototype');
externalScript('lk/JSON');
externalScript('lk/defaultconfig');
externalScript('local-LK-config');
externalScript('lk/Base');
externalScript('lk/scene');
externalScript('lk/Core');
externalScript('lk/Text');
externalScript('lk/Widgets');
externalScript('lk/Network');
externalScript('lk/Data');
externalScript('lk/Storage');
externalScript('lk/bindings');
externalScript('lk/Tools');
externalScript('lk/TestFramework');
externalScript('lk/TouchSupport');
externalScript('lk/cop/Layers');
externalScript('jslint');
newModule('core/testFramework');
newModule('transporter/object_graph_walker');
doIt('transporter.putUnownedSlotsInInitModule();');
newModule('core/accessors');
newModule('core/exit');
newModule('core/range');
newModule('core/enumerator');
newModule('core/commands');
newModule('core/string_buffer');
newModule('core/string_extensions');
newModule('core/value_holder');
newModule('core/dependencies');
newModule('core/little_profiler');
newModule('core/math');
newModule('core/sound');
newModule('core/linked_list');
externalScript('lk_ext/fixes');
newModule('core/types');
externalScript('lk_ext/menus');
externalScript('lk_ext/changes');
externalScript('lk_ext/change_notification');
externalScript('lk_ext/grabbing');
newModule('lk_ext/wheel_menus');
newModule('lk_ext/commands');
newModule('lk_ext/applications');
newModule('lk_ext/highlighting');
externalScript('lk_ext/refreshing_content');
newModule('lk_ext/transporting_morphs');
newModule('lk_ext/one_morph_per_object');
externalScript('lk_ext/shortcuts');
externalScript('lk_ext/text_morph_variations');
externalScript('lk_ext/check_box');
newModule('lk_ext/layout');
newModule('lk_ext/rows_and_columns');
newModule('lk_ext/combo_box');
newModule('lk_ext/collection_morph');
externalScript('lk_ext/expander');
newModule('lk_ext/tree_morph');
externalScript('lk_ext/expander');
newModule('lk_ext/morph_factories');
newModule('lk_ext/arrows');
newModule('lk_ext/message_notifier');
newModule('lk_ext/placeholder_morph');
newModule('lk_ext/edit_mode');
newModule('lk_ext/scripting');
newModule('lk_ext/carrying_hand');
newModule('lk_ext/core_sampler');
newModule('lk_ext/world_navigation');
newModule('reflection/annotation');
newModule('reflection/process');
newModule('core/identity_hash');
newModule('core/hash_table');
newModule('core/notifier');
newModule('core/graphs');
newModule('core/core');
newModule('reflection/mirror');
newModule('reflection/slot');
newModule('reflection/remote_reflection');
newModule('reflection/vocabulary');
newModule('lk_ext/optional_morph');
newModule('lk_ext/toggler');
newModule('lk_ext/scale_to_adjust_details');
newModule('core/poses');
newModule('lk_ext/poses');
newModule('reflection/category');
newModule('reflection/organization');
newModule('reflection/reflection');
newModule('transporter/transporter');
newModule('core/quickhull');
newModule('core/animation_math');
newModule('lk_ext/animation');
newModule('lk_ext/scatter');
newModule('lk_ext/lk_ext');
newModule('avocado_lib');
doIt('transporter.doneLoadingAvocadoLib();');
newModule('programming_environment/categorize_libraries');
newModule('lk_programming_environment/module_morph');
newModule('transporter/snapshotter');
newModule('lk_programming_environment/vocabulary_morph');
newModule('lk_programming_environment/test_case_morph');
newModule('lk_programming_environment/evaluator_morph');
externalScript('narcissus/jsparse');
newModule('programming_environment/pretty_printer');
newModule('programming_environment/searching');
newModule('lk_programming_environment/category_morph');
newModule('lk_ext/search_results_morph');
newModule('lk_programming_environment/searching');
newModule('lk_programming_environment/slot_morph');
newModule('lk_programming_environment/mirror_morph');
newModule('lk_programming_environment/process_morph');
newModule('projects/projects');
newModule('lk_programming_environment/project_morph');
newModule('db/abstract');
newModule('lk_programming_environment/db_morph');
newModule('db/couch');
newModule('lk_programming_environment/programming_environment');
doIt('transporter.doneLoadingAllAvocadoCode();');

# end of auto-generated code

postscript();
