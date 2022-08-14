// given a flag key, determine if this user context qualifies for it
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

// convert targetAttribute (from flag rule)
const convertAttributeType = (attributeValue, op) => {
  switch (op) {
    // EQ will always compare 1:1
    case "EQ":
      attributeValue = attributeValue[0];
      // string, do nothing
      // boolean, number convert
      if (attributeValue === 'true' || attributeValue === 'false') {
        return Boolean(attributeValue);
      } else if (!isNaN(Number(attributeValue))) {
        return Number(attributeValue);
      }
      break;
    // following cases will always be just a single number
    case "GT":
    case "LT":
    case "LT_EQ":
    case "GT_EQ":
      attributeValue = attributeValue[0];
      return Number(attributeValue);
    // following cases won't be multiple values
    case "STR_CONTAINS":
    case "STR_ENDS_WITH":
    case "STR_STARTS_WITH":
      attributeValue = attributeValue[0];
      break;
  }
  return attributeValue;
}

// for one attribute
const evaluateCondition = (userContext, condition) => {
  const op = condition.operator;
  const attribute = condition.attribute;
  // cast targetValue type based on operator and candidateValue type
  const targetValue = convertAttributeType(condition.vals, op);
  const candidateValue = userContext[attribute];
  let result;
  // if attribute not provided in userContext, always false regardless of negate
  if (!userContext.hasOwnProperty(attribute)) return false;
  result = operandMapper[op](targetValue, candidateValue);
  return condition.negate ? !result : result;
};
// evaluate for flag
const evaluate = (flagKey, userContext, client, defaultValue) => {
  // console.log(`Evaluating ${flagKey}`)
  // if flag doesn't exist, return defaultVaue
  if (!client.flags.hasOwnProperty(flagKey)) {
    console.log(`Flag key ${flagKey} not found. Returning ${defaultValue}.`)
    return defaultValue;
  }
  // otherwise, evaluate audience
  const flag = client.flags[flagKey]
  const { status, ...targetedAudiences } = flag;
  // console.log(`${flagKey} qualifies with any of these audiences: ${targetedAudiences}`)
  // console.log(`We are using this user context: ${JSON.stringify(userContext)}`)
  let evaluation = false;
  // flags without any audience targeting apply to everyone
  if (!status) {
    return evaluation;
  }

  if (Object.keys(targetedAudiences).length == 0)  {
    evaluation = true
  } else {
    // loop through the array of targeted audiences
    for (let audience in targetedAudiences) {
      // console.log(`Looking at audience ${audience}`)
      const audienceContext = flag[audience];
      evaluation = evaluateAudience(audienceContext, userContext)
      // since ANY audience is required, break early if true
      if (evaluation) {
        break;
      }
    }
  }
  return evaluation;
}
// evaluate audience conditions based on user attributes
function evaluateAudience(audienceContext, userContext) {
  let evaluation = false; // default to false
  for (const condition of audienceContext.conditions) {
    if (evaluateCondition(userContext, condition)) {
      evaluation = true;
      if (audienceContext.combine === 'ANY') {
        // if 'ANY' set, then return as soon as one condition is satisfied
        break;
      } else if (audienceContext.combine === 'ALL') {
        // keep going until all conditions are evaluated
        continue;
      }
    } else { // condition was false
      // if condition is not met and ANY, keep going until theres no more conditions
      if (audienceContext.combine === 'ALL') {
        // exit early because at least one condition was not met.
        evaluation = false;
        break;
      }
      // 'ANY' and false, go to next condition
    }
  }
  // console.log('audience key evaluations', audienceEvals);
  return evaluation;
}

module.exports = evaluate;