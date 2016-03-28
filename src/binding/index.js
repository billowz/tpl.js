const _ = require('../util'),
  testsContext = require.context('.', true);

testsContext.keys().forEach(testsContext);
