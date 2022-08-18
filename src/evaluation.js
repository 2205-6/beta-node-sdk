const isEq = (targetVal, candidateVal) => {
  if (typeof candidateVal === 'string') {
    candidateVal = candidateVal.toLowerCase();
    return candidateVal === targetVal.toLowerCase();
  }

  return candidateVal === targetVal;
};

const isIn = (targetVals, candidateVal) => {
  targetVals = targetVals.map(val => val.toLowerCase());
  return targetVals.includes(candidateVal.toLowerCase());
}
const strContains = (targetVal, candidateVal) => 
  candidateVal.toLowerCase().includes(targetVal.toLowerCase());
const strEndsWith = (targetVal, candidateVal) =>
  candidateVal.toLowerCase().endsWith(targetVal.toLowerCase());
const strStartsWith = (targetVal, candidateVal) =>
  candidateVal.toLowerCase().startsWith(targetVal.toLowerCase());

const isGreaterThan = (targetVal, candidateVal) => candidateVal > targetVal;
const isGreaterEqThan = (targetVal, candidateVal) => candidateVal >= targetVal;
const isLessThan = (targetVal, candidateVal) => candidateVal < targetVal;
const isLessEqThan = (targetVal, candidateVal) => candidateVal <= targetVal;

let operandMapper = {
  EQ: isEq,
  IN: isIn,
  STR_CONTAINS: strContains,
  STR_ENDS_WITH: strEndsWith,
  STR_STARTS_WITH: strStartsWith,
  GT: isGreaterThan,
  LT: isLessThan,
  LT_EQ: isLessEqThan,
  GT_EQ: isGreaterEqThan,
};

const convertAttributeType = (attributeValue, op) => {
  switch (op) {
    case 'EQ':
      attributeValue = attributeValue[0];
      if (attributeValue === 'true') {
        return true
      } else if (attributeValue === 'false') {
        return false
      } else if (!isNaN(Number(attributeValue))) {
        return Number(attributeValue);
      }
      break;
    case "GT":
    case "LT":
    case "LT_EQ":
    case "GT_EQ":
      attributeValue = attributeValue[0];
      return Number(attributeValue);
    case "STR_CONTAINS":
    case "STR_ENDS_WITH":
    case "STR_STARTS_WITH":
      attributeValue = attributeValue[0];
      break;
  }
  return attributeValue;
}

const evaluateCondition = (userContext, condition) => {
  const op = condition.operator;
  const attribute = condition.attribute;
  const targetValue = convertAttributeType(condition.vals, op);
  const candidateValue = userContext[attribute];
  let result;
  if (!userContext.hasOwnProperty(attribute)) return false;
  result = operandMapper[op](targetValue, candidateValue);
  return condition.negate ? !result : result;
};
const evaluate = (flagKey, userContext, client, defaultValue) => {
  if (!client.flags.hasOwnProperty(flagKey)) {
    console.log(`Flag key ${flagKey} not found. Returning ${defaultValue}.`)
    return defaultValue;
  }
  const flag = client.flags[flagKey]
  const { status, ...targetedAudiences } = flag;
  let evaluation = false;
  if (!status) {
    return evaluation;
  }

  if (Object.keys(targetedAudiences).length == 0)  {
    evaluation = true
  } else {
    for (let audience in targetedAudiences) {
      const audienceContext = flag[audience];
      evaluation = evaluateAudience(audienceContext, userContext)
      if (evaluation) {
        break;
      }
    }
  }
  return evaluation;
}
function evaluateAudience(audienceContext, userContext) {
  let evaluation = false;
  for (const condition of audienceContext.conditions) {
    if (evaluateCondition(userContext, condition)) {
      evaluation = true;
      if (audienceContext.combine === 'ANY') {
        break;
      } else if (audienceContext.combine === 'ALL') {
        continue;
      }
    } else {
      if (audienceContext.combine === 'ALL') {
        evaluation = false;
        break;
      }
    }
  }
  return evaluation;
}

module.exports = evaluate;