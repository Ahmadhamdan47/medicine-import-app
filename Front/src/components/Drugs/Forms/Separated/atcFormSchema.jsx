const yup = require('yup');

const atcFormSchema = yup.object().shape({
  guid: yup.string().uuid().required(),
  code: yup.string().max(255).required(),
  levelName: yup.string().required(),
  levelNameAr: yup.string().required(),
  atcrelatedLabel: yup.string().required(),
  enabled: yup.boolean().required(),
});

module.exports = atcFormSchema;
