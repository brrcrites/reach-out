import RecurringJobSystem from '../app/RecurringJob.js';

var jobSystem = null;

beforeEach(() => {
    jobSystem = new RecurringJobSystem();
});

afterEach(() => {
    jobSystem = null;
})

test('created jobs are stored in cache', () => {
    const jobUUID = jobSystem.createJob({ message: null });

    expect(jobSystem.getIds()).toEqual(expect.arrayContaining([jobUUID]));
});

test('created jobs can be deleted', () => {
    const jobUUID = jobSystem.createJob({ message: null });

    expect(jobSystem.deleteJob(jobUUID)).toBe(true);
    expect(jobSystem.getIds()).toEqual(expect.not.arrayContaining([jobUUID]))
});

test('created jobs can only be deleted once', () => {
    const jobUUID = jobSystem.createJob({ message: null });

    expect(jobSystem.deleteJob(jobUUID)).toBe(true);
    expect(jobSystem.deleteJob(jobUUID)).toBe(false);
});

test('the correct created job is deleted', () => {
    const jobUUIDtoStayFirst = jobSystem.createJob({ message: null });
    const jobUUIDtoRemove = jobSystem.createJob({ message: null });
    const jobUUIDtoStaySecond = jobSystem.createJob({ message: null });

    expect(jobSystem.deleteJob(jobUUIDtoRemove)).toBe(true);
    expect(jobSystem.getIds()).toEqual(expect.arrayContaining([jobUUIDtoStayFirst, jobUUIDtoStaySecond]));
});