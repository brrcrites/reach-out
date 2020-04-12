import RecurringJobSystem from '../app/RecurringJob.js';

var jobSystem = null;

beforeEach(() => {
    jobSystem = new RecurringJobSystem();
});

// TODO: Consider adding a clear() function to the RecurringJob system and
// using that here rather than constructing a new object each time
afterEach(() => {
    jobSystem = null;
})

test('validate created jobs can be deleted', () => {
    const jobUUID = jobSystem.createJob({
        message: 'this is a test'
    });
    expect(jobSystem.deleteJob(jobUUID)).toBe(true);
});

test('validate created jobs can only be deleted once', () => {
    const jobUUID = jobSystem.createJob({
        message: 'this is a test'
    });
    expect(jobSystem.deleteJob(jobUUID)).toBe(true);
    expect(jobSystem.deleteJob(jobUUID)).toBe(false);
});