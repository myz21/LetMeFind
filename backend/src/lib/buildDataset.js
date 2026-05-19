const scenarios = require('../data/scenarios');

function normalise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function chooseScenario(query, scenarioIndex) {
  const queryText = normalise(query);
  if (Number.isInteger(scenarioIndex) && scenarios[scenarioIndex]) {
    return { index: scenarioIndex, scenario: scenarios[scenarioIndex] };
  }

  if (queryText.includes('dar') || queryText.includes('katlanabilir') || queryText.includes('açık')) {
    return { index: 1, scenario: scenarios[1] };
  }

  return { index: 0, scenario: scenarios[0] };
}

function buildDataset({ query, scenarioIndex }) {
  const selection = chooseScenario(query, scenarioIndex);
  const scenario = selection.scenario;
  const resolvedQuery = query && String(query).trim() ? query.trim() : scenario.query;

  return {
    scenarioIndex: selection.index,
    dataset: {
      ...scenario,
      query: resolvedQuery,
      title: resolvedQuery === scenario.query ? scenario.title : `${resolvedQuery} için eşleşmeler`,
    },
  };
}

module.exports = {
  buildDataset,
  scenarios,
};