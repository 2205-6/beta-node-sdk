const evaluate = require('../src/evaluation.js');

const client = {
  flags: {
    'flag_off': {
      status: false
    },
    'flag_on_for_all': {
      status: true
    },
    'string_eq_ca_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'EQ',
          vals: ['CA'],
          negate: false
        }]
      }
    },
    'string_in_ca_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'IN',
          vals: ['CA', 'OR'],
          negate: false
        }]
      }
    },
    'string_contains_c_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'STR_CONTAINS',
          vals: ['c'],
          negate: false
        }]
      }
    },
    'string_ends_with_a_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'STR_ENDS_WITH',
          vals: ['a'],
          negate: false
        }]
      }
    },
    'string_starts_with_c_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'STR_STARTS_WITH',
          vals: ['c'],
          negate: false
        }]
      }
    },
    'string_eq_ca_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'EQ',
          vals: ['CA'],
          negate: true
        }]
      }
    },
    'string_in_ca_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'IN',
          vals: ['CA', 'OR'],
          negate: true
        }]
      }
    },
    'string_contains_c_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'STR_CONTAINS',
          vals: ['c'],
          negate: true
        }]
      }
    },
    'string_ends_with_a_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'STR_ENDS_WITH',
          vals: ['a'],
          negate: true
        }]
      }
    },
    'string_starts_with_c_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'state',
          operator: 'STR_STARTS_WITH',
          vals: ['c'],
          negate: true
        }]
      }
    },
    'num_eq_20_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'age',
          operator: 'EQ',
          vals: ['20'],
          negate: false
        }]
      }
    },
    'num_gt_35_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'age',
          operator: 'GT',
          vals: ['35'],
          negate: false
        }]
      }
    },
    'num_lt_35_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'age',
          operator: 'LT',
          vals: ['35'],
          negate: false
        }]
      }
    },
    'num_eq_20_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'age',
          operator: 'EQ',
          vals: ['20'],
          negate: true
        }]
      }
    },
    'num_gt_35_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'age',
          operator: 'GT',
          vals: ['35'],
          negate: true
        }]
      }
    },
    'num_lt_35_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'age',
          operator: 'LT',
          vals: ['35'],
          negate: true
        }]
      }
    },
    'bool_eq_true_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'student',
          operator: 'EQ',
          vals: ['true'],
          negate: false
        }]
      }
    },
    'bool_eq_true_condition_neg': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'student',
          operator: 'EQ',
          vals: ['true'],
          negate: true
        }]
      }
    },
    'student_or_20_condition': {
      status: true,
      'aud_1': {
        combine: 'ANY',
        conditions: [{
          attribute: 'student',
          operator: 'EQ',
          vals: ['true'],
          negate: false
        }, 
        {
          attribute: 'age',
          operator: 'EQ',
          vals: ['20'],
          negate: false
        }]
      }
    },
    'student_and_20_condition': {
      status: true,
      'aud_1': {
        combine: 'ALL',
        conditions: [{
          attribute: 'student',
          operator: 'EQ',
          vals: ['true'],
          negate: false
        }, 
        {
          attribute: 'age',
          operator: 'EQ',
          vals: ['20'],
          negate: false
        }]
      }
    }
  }
}

const userContextCA = {
  state: 'CA'
}

const userContextFL = {
  state: 'FL'
}

const userContext20 = {
  age: 20
}

const userContext50 = {
  age: 50
}

const userContextStudent = {
  student: true
}

const userContextNonStudent = {
  student: false
}

const userContextStudent20 = {
  student: true,
  age: 20
}

describe('returns default values', () => {
  test('returns default value of false on a nonexistent flag key', () => {
    // (flagKey, userContext, client, defaultValue)
    const evaluation = evaluate('nonexistent', userContextCA, client, false)
    expect(evaluation).toBe(false);
  })

  test('returns default value of true on a nonexistent flag key', () => {
    const evaluation = evaluate('nonexistent', userContextCA, client, true)
    expect(evaluation).toBe(true);
  })
})

describe('flag is off', () => {
  test('returns false when flag status is false', () => {
    const evaluation = evaluate('flag_off', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })
})

describe('flag is on, no audiences', () => {
  test('returns true when flag status is true with no auds', () => {
    const evaluation = evaluate('flag_on_for_all', userContextCA, client, false);
    expect(evaluation).toBe(true);
  })
})

describe('string operators testing', () => {
  test('EQ true', () => {
    const evaluation = evaluate('string_eq_ca_condition', userContextCA, client, false);
    expect(evaluation).toBe(true);
  })

  test('EQ false', () => {
    const evaluation = evaluate('string_eq_ca_condition', userContextFL, client, true);
    expect(evaluation).toBe(false);
  })

  test('IN true', () => {
    const evaluation = evaluate('string_in_ca_condition', userContextCA, client, false);
    expect(evaluation).toBe(true);
  })

  test('IN false', () => {
    const evaluation = evaluate('string_in_ca_condition', userContextFL, client, true);
    expect(evaluation).toBe(false);
  })

  test('STR_CONTAINS true', () => {
    const evaluation = evaluate('string_contains_c_condition', userContextCA, client, false);
    expect(evaluation).toBe(true);
  })

  test('STR_CONTAINS false', () => {
    const evaluation = evaluate('string_contains_c_condition', userContextFL, client, true);
    expect(evaluation).toBe(false);
  })

  test('STR_ENDS_WITH true', () => {
    const evaluation = evaluate('string_ends_with_a_condition', userContextCA, client, false);
    expect(evaluation).toBe(true);
  })

  test('STR_ENDS_WITH false', () => {
    const evaluation = evaluate('string_ends_with_a_condition', userContextFL, client, true);
    expect(evaluation).toBe(false);
  })

  test('STR_STARTS_WITH true', () => {
    const evaluation = evaluate('string_starts_with_c_condition', userContextCA, client, false);
    expect(evaluation).toBe(true);
  })

  test('STR_STARTS_WITH false', () => {
    const evaluation = evaluate('string_starts_with_c_condition', userContextFL, client, true);
    expect(evaluation).toBe(false);
  })

  test('EQ true neg', () => {
    const evaluation = evaluate('string_eq_ca_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('EQ false neg', () => {
    const evaluation = evaluate('string_eq_ca_condition_neg', userContextFL, client, false);
    expect(evaluation).toBe(true);
  })

  test('IN true neg', () => {
    const evaluation = evaluate('string_in_ca_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('IN false neg', () => {
    const evaluation = evaluate('string_in_ca_condition_neg', userContextFL, client, false);
    expect(evaluation).toBe(true);
  })

  test('STR_CONTAINS true neg', () => {
    const evaluation = evaluate('string_contains_c_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('STR_CONTAINS false neg', () => {
    const evaluation = evaluate('string_contains_c_condition_neg', userContextFL, client, false);
    expect(evaluation).toBe(true);
  })

  test('STR_ENDS_WITH true neg', () => {
    const evaluation = evaluate('string_ends_with_a_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('STR_ENDS_WITH false neg', () => {
    const evaluation = evaluate('string_ends_with_a_condition_neg', userContextFL, client, false);
    expect(evaluation).toBe(true);
  })

  test('STR_STARTS_WITH true neg', () => {
    const evaluation = evaluate('string_starts_with_c_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('STR_STARTS_WITH false neg', () => {
    const evaluation = evaluate('string_starts_with_c_condition_neg', userContextFL, client, false);
    expect(evaluation).toBe(true);
  })
})

describe('number operators testing', () => {
  test('EQ true', () => {
    const evaluation = evaluate('num_eq_20_condition', userContext20, client, false);
    expect(evaluation).toBe(true);
  })

  test('EQ false', () => {
    const evaluation = evaluate('num_eq_20_condition', userContext50, client, true);
    expect(evaluation).toBe(false);
  })

  test('GT true', () => {
    const evaluation = evaluate('num_gt_35_condition', userContext50, client, false);
    expect(evaluation).toBe(true);
  })

  test('GT false', () => {
    const evaluation = evaluate('num_gt_35_condition', userContext20, client, true);
    expect(evaluation).toBe(false);
  })

  test('LT true', () => {
    const evaluation = evaluate('num_lt_35_condition', userContext20, client, false);
    expect(evaluation).toBe(true);
  })

  test('LT false', () => {
    const evaluation = evaluate('num_lt_35_condition', userContext50, client, true);
    expect(evaluation).toBe(false);
  })

  test('EQ true neg', () => {
    const evaluation = evaluate('num_eq_20_condition_neg', userContext20, client, true);
    expect(evaluation).toBe(false);
  })

  test('EQ false neg', () => {
    const evaluation = evaluate('num_eq_20_condition_neg', userContext50, client, false);
    expect(evaluation).toBe(true);
  })

  test('GT true neg', () => {
    const evaluation = evaluate('num_gt_35_condition_neg', userContext50, client, true);
    expect(evaluation).toBe(false);
  })

  test('GT false neg', () => {
    const evaluation = evaluate('num_gt_35_condition_neg', userContext20, client, false);
    expect(evaluation).toBe(true);
  })

  test('LT true neg', () => {
    const evaluation = evaluate('num_lt_35_condition_neg', userContext20, client, true);
    expect(evaluation).toBe(false);
  })

  test('LT false neg', () => {
    const evaluation = evaluate('num_lt_35_condition_neg', userContext50, client, false);
    expect(evaluation).toBe(true);
  })
})

describe('boolean operators testing', () => {
  test('EQ true', () => {
    const evaluation = evaluate('bool_eq_true_condition', userContextStudent, client, false);
    expect(evaluation).toBe(true);
  })

  test('EQ false', () => {
    const evaluation = evaluate('bool_eq_true_condition', userContextNonStudent, client, true);
    expect(evaluation).toBe(false);
  })

  test('EQ true neg', () => {
    const evaluation = evaluate('bool_eq_true_condition_neg', userContextStudent, client, true);
    expect(evaluation).toBe(false);
  })

  test('EQ false neg', () => {
    const evaluation = evaluate('bool_eq_true_condition_neg', userContextNonStudent, client, false);
    expect(evaluation).toBe(true);
  })
})

describe('testing contexts without relevant attributes', () => {
  test('testing state condition without a state context', () => {
    const evaluation = evaluate('string_eq_ca_condition', userContext20, client, true);
    expect(evaluation).toBe(false);
  })

  test('testing age condition without an age context', () => {
    const evaluation = evaluate('num_eq_20_condition', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('testing student condition without a student context', () => {
    const evaluation = evaluate('bool_eq_true_condition', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('testing state condition without a state context neg should not affect final result', () => {
    const evaluation = evaluate('string_eq_ca_condition_neg', userContext20, client, true);
    expect(evaluation).toBe(false);
  })

  test('testing age condition without an age context neg should not affect final result', () => {
    const evaluation = evaluate('num_eq_20_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })

  test('testing student condition without a student context neg should not affect final result', () => {
    const evaluation = evaluate('bool_eq_true_condition_neg', userContextCA, client, true);
    expect(evaluation).toBe(false);
  })
})

describe('testing multiple conditions ANY', () => {
  test('age 20 or student true', () => {
    const evaluation = evaluate('student_or_20_condition', userContextStudent, client, false);
    expect(evaluation).toBe(true);
    const evaluation2 = evaluate('student_or_20_condition', userContext20, client, false);
    expect(evaluation2).toBe(true);
  })

  test('age 20 or student false', () => {
    const evaluation = evaluate('student_or_20_condition', userContextNonStudent, client, true);
    expect(evaluation).toBe(false);
    const evaluation2 = evaluate('student_or_20_condition', userContext50, client, true);
    expect(evaluation2).toBe(false);
  })
})

describe('testing multiple conditions ALL', () => {
  test('age 20 and student true', () => {
    const evaluation = evaluate('student_and_20_condition', userContextStudent20, client, false);
    expect(evaluation).toBe(true);
  })

  test('age 20 and student false', () => {
    const evaluation = evaluate('student_and_20_condition', userContextStudent, client, true);
    expect(evaluation).toBe(false);
    const evaluation2 = evaluate('student_and_20_condition', userContext20, client, true);
    expect(evaluation2).toBe(false);
  })
})