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
newModule('projects/projects');
newModule('core/accessors');
newModule('core/exit');
newModule('core/enumerator');
newModule('core/range');
newModule('core/string_buffer');
newModule('core/string_extensions');
newModule('core/commands');
newModule('core/value_holder');
newModule('core/little_profiler');
newModule('core/math');
newModule('core/dependencies');
newModule('core/sound');
newModule('core/linked_list');
newModule('core/types');
externalScript('lk_ext/change_notification');
externalScript('lk_ext/changes');
externalScript('lk_ext/fixes');
externalScript('lk_ext/menus');
newModule('lk_ext/wheel_menus');
newModule('lk_ext/highlighting');
newModule('lk_ext/applications');
externalScript('lk_ext/refreshing_content');
externalScript('lk_ext/grabbing');
newModule('lk_ext/commands');
newModule('lk_ext/transporting_morphs');
newModule('lk_ext/one_morph_per_object');
externalScript('lk_ext/check_box');
externalScript('lk_ext/text_morph_variations');
externalScript('lk_ext/shortcuts');
newModule('lk_ext/layout');
newModule('lk_ext/rows_and_columns');
newModule('lk_ext/combo_box');
newModule('lk_ext/collection_morph');
newModule('lk_ext/message_notifier');
newModule('lk_ext/core_sampler');
externalScript('lk_ext/expander');
newModule('lk_ext/tree_morph');
externalScript('lk_ext/expander');
newModule('lk_ext/morph_factories');
newModule('lk_ext/arrows');
newModule('lk_ext/edit_mode');
newModule('reflection/annotation');
newModule('lk_ext/placeholder_morph');
newModule('lk_ext/scripting');
newModule('lk_ext/world_navigation');
newModule('lk_ext/carrying_hand');
newModule('reflection/process');
newModule('core/identity_hash');
newModule('core/hash_table');
newModule('core/notifier');
newModule('core/graphs');
newModule('core/core');
newModule('reflection/mirror');
newModule('reflection/slot');
newModule('reflection/vocabulary');
newModule('reflection/remote_reflection');
newModule('lk_ext/morph_hider');
newModule('lk_ext/scaling');
newModule('lk_ext/toggler');
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
newModule('transporter/snapshotter');
newModule('lk_programming_environment/module_morph');
newModule('programming_environment/categorize_libraries');
newModule('lk_programming_environment/evaluator_morph');
newModule('lk_programming_environment/test_case_morph');
newModule('lk_programming_environment/vocabulary_morph');
newModule('lk_programming_environment/project_morph');
externalScript('narcissus/jsparse');
newModule('programming_environment/pretty_printer');
newModule('lk_programming_environment/category_morph');
newModule('lk_programming_environment/slot_morph');
newModule('lk_programming_environment/mirror_morph');
newModule('lk_programming_environment/process_morph');
newModule('lk_ext/search_results_morph');
newModule('programming_environment/searching');
newModule('lk_programming_environment/searching');
newModule('db/abstract');
newModule('lk_programming_environment/db_morph');
newModule('db/couch');
newModule('lk_programming_environment/programming_environment');
doIt('transporter.doneLoadingAllAvocadoCode();');