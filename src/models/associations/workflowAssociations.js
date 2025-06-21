const WorkflowState = require('../workflowState');
const StepCompletion = require('../stepCompletion');
const QualityReview = require('../qualityReview');
const PricingReview = require('../pricingReview');
const WorkflowNotification = require('../workflowNotification');
const DrugsUnderProcess = require('../drugsUnderProcess');

// WorkflowState associations
WorkflowState.hasMany(StepCompletion, {
    foreignKey: 'workflow_id',
    as: 'stepCompletions'
});

WorkflowState.hasOne(QualityReview, {
    foreignKey: 'workflow_id',
    as: 'qualityReview'
});

WorkflowState.hasOne(PricingReview, {
    foreignKey: 'workflow_id',
    as: 'pricingReview'
});

WorkflowState.hasMany(WorkflowNotification, {
    foreignKey: 'workflow_id',
    as: 'notifications'
});

// Reverse associations
StepCompletion.belongsTo(WorkflowState, {
    foreignKey: 'workflow_id',
    as: 'workflow'
});

QualityReview.belongsTo(WorkflowState, {
    foreignKey: 'workflow_id',
    as: 'workflow'
});

PricingReview.belongsTo(WorkflowState, {
    foreignKey: 'workflow_id',
    as: 'workflow'
});

WorkflowNotification.belongsTo(WorkflowState, {
    foreignKey: 'workflow_id',
    as: 'workflow'
});

// Drug associations
DrugsUnderProcess.hasOne(WorkflowState, {
    foreignKey: 'drug_id',
    as: 'workflowState'
});

WorkflowState.belongsTo(DrugsUnderProcess, {
    foreignKey: 'drug_id',
    as: 'drug'
});

module.exports = {
    WorkflowState,
    StepCompletion,
    QualityReview,
    PricingReview,
    WorkflowNotification,
    DrugsUnderProcess
};
