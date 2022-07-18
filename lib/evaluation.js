// given a flag key, determine if this user context qualifies for it

const isEq = (targetVal, candidateVal) => {
  return String(candidateVal) === String(targetVal);
};
const isIn = (targetVals, candidateVal) =>
  targetVals.includes(candidateVal.toLowerCase());
const isNotIn = (targetVals, candidateVal) =>
  !targetVals.includes(candidateVal.toLowerCase());
const strContains = (targetVal, candidateVal) =>
  candidateVal.toLowerCase().includes(targetVal);
const strEndsWith = (targetVal, candidateVal) =>
  candidateVal.toLowerCase().endsWith(targetVal);
const strStartsWith = (targetVal, candidateVal) =>
  candidateVal.toLowerCase().startsWith(targetVal);

const isGreaterThan = (targetVal, candidateVal) => candidateVal > targetVal;
const isGreaterEqThan = (targetVal, candidateVal) => candidateVal >= targetVal;
const isLessThan = (targetVal, candidateVal) => candidateVal < targetVal;
const isLessEqThan = (targetVal, candidateVal) => candidateVal <= targetVal;

let operandMapper = {
  EQ: isEq,
  IN: isIn,
  NOT_IN: isNotIn,
  STR_CONTAINS: strContains,
  STR_ENDS_WITH: strEndsWith,
  STR_STARTS_WITH: strStartsWith,
  GT: isGreaterThan,
  LT: isLessThan,
  LT_EQ: isLessEqThan,
  GT_EQ: isGreaterEqThan,
};
// for one attribute
const evaluateCondition = (userContext, condition) => {
  const op = condition.operator;
  const attribute = condition.attribute;
  // targetValue needs to be cast to whatever condition.type is
  const targetValue = condition.value;
  const candidateValue = userContext[attribute];
  if (!candidateValue) return false;
  return operandMapper[op](targetValue, candidateValue);
};

const evaluate = (flagKey, userContext, client) => {
  console.log(`Evaluating ${flagKey}`)
  // get the array of targeted audiences
  if (!client.flags.hasOwnProperty(flagKey)) {
    console.log(`Flag key ${flagKey} not found. Returning false.`)
    return false;
  }
  const targetedAudiences = client.flags[flagKey]; // ['beta-testers', 'big-state']
  console.log(`${flagKey} qualifies with any of these audiences: ${targetedAudiences}`)
  console.log(`We are using this user context: ${JSON.stringify(userContext)}`)
  // loop through the array of targeted audiences
  for (let audience of targetedAudiences) {
    console.log(`Looking at audience ${audience}`)
    // audience = beta-testers
    if (!client.audiences.hasOwnProperty(audience)) {
      console.log(`Audience ${audience} not found. Moving on to next audience`)
      continue;
    }
    let combination = client.audiences[audience].combination; // ALL
    console.log(`${audience} requires that ${combination} following conditions be met:`)
    let conditions = client.audiences[audience].conditions;
    conditions.forEach(con => {
      console.log(`${con.attribute} ${con.operator} ${con.value}`)
    })
    // [
    //   {
    //     attribute: 'beta',
    //     type: 'bool',
    //     operator: 'EQ',
    //     value: true
    //   },
    //   {
    //     attribute: 'group',
    //     type: 'string',
    //     operator: 'EQ',
    //     value: 'beta'
    //   }
    // ]

    // loop through the conditions to see if the user context meets it
    console.log(`Looping through conditions for ${audience}, looking for ${combination} matches`)
    if (combination === 'ANY') {
      for (let condition of conditions) {
        console.log(`Looking at condition: ${condition.attribute} ${condition.operator} ${condition.value}`)
        let userMeetsCondition = evaluateCondition(userContext, condition);
        // since we're okay with any of the conditions meeting, we break after we get true
        if (userMeetsCondition) {
          console.log(`User does meet this condition, so the user qualifies for audience ${audience}`)
          console.log(`Since the flag requires that ANY audience be met, we return TRUE`)
          // overall function returns true because the user met the condition
          // for this one audience. since it's ANY, it means any fulfilled condition
          // qualifies the user for aud. and since the user only needs to meet ANY audiences,
          // it means the user is overall qualified for the flag
          return true;
        }
        console.log(`User does not meet this condition, so let's look at the next one`)
      }
    } else if (combination === 'ALL') {
      let userMeetsAllConditions = true;
      for (let condition of conditions) {
        console.log(`Looking at condition: ${condition.attribute} ${condition.operator} ${condition.value}`)
        let userMeetsCondition = evaluateCondition(userContext, condition);
        // all conditions must be met for these, so we break after we get false
        if (!userMeetsCondition) {
          console.log(`User does not meet this condition. since this audience requires ALL conditions to be met, user does not qualify for ${audience}`)
          console.log(`We move on to the next audience.`)
          // if the user doesn't meet a condition, it means they don't qualify
          // for this aud anymore. we just break out and move to the next
          // aud.
          userMeetsAllConditions = false;
          break;
        }
        console.log(`User does meet condition ${condition.attribute} ${condition.operator} ${condition.value}, so let's move on to the next one`)
      }
      // after the loop, we check to make sure the user did indeed meet all conditions
      // if so, we just return true, bc it means they qualify for the audience, and hence
      // the flag as well. 
      // if not, we move on to the next audience to check to see if they qualify
      // for that one
      if (userMeetsAllConditions) {
        console.log(`User meets all conditions for audience ${audience}`)
        console.log(`Since the flag requires that ANY audience be met, we return TRUE`)
        return true;
      }
    }
    // if we get to this point, it means that we got through all of the audiences and their conditions
    // without any short-circuiting. this means the user does not qualify. 
  }
  console.log(`user does not qualify for any audiences, so we return FALSE`)
  return false;
    // for each one, check to see if the current user context matches it
    // also consider the combination
}

// /*

// let c = {
//   userContext: { userId: 'jjuy', beta: true, state: 'ca'},
//   flags: {
//     'beta-header': ['beta-testers', 'small-state']
//   },
//   audiences:   {
//     "beta-testers": {
//       combination: 'ALL',
//       conditions: [
//         {
//           attribute: 'beta',
//           type: 'bool',
//           operator: 'EQ',
//           value: true
//         },
//         {
//           attribute: 'group',
//           type: 'string',
//           operator: 'EQ',
//           value: 'beta'
//         }
//       ]
//     },
//     "big-state": {
//       combination: 'ANY',
//       conditions: [
//         {
//           attribute: 'state',
//           type: 'string',
//           operator: 'EQ',
//           value: 'ca'
//         },
//         {
//           attribute: 'state',
//           type: 'string',
//           operator: 'EQ',
//           value: 'tx'
//         }
//       ]
//     }
//   }
// }

// console.log(evaluate('beta-header', c))

module.exports = evaluate;