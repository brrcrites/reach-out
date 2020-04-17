import RecurringJobSystem from '../app/RecurringJob.js';
import mongoose from 'mongoose';
import regeneratorRuntime from "regenerator-runtime";

var jobSystem = null;

// Setup and tear down the database connection before running any tests
beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
});

afterAll(async() => {
    await mongoose.disconnect();
});

// Reset the job system in-between each test so we don't have any hold over data
beforeEach(() => {
    jobSystem = new RecurringJobSystem();
});

afterEach(() => {
    [...jobSystem.jobCache.values()].forEach( (job) => { job.cancel(); });
    jobSystem = null;
});

test('created jobs are stored in cache', () => {
    const jobUUID = jobSystem.createJob({ message: null });

    expect(jobSystem.getRunning()).toEqual(expect.arrayContaining([jobUUID]));
});

test('created jobs can be deleted', () => {
    const jobUUID = jobSystem.createJob({ message: null });

    expect(jobSystem.deleteJob(jobUUID)).toBe(true);
    expect(jobSystem.getRunning()).toEqual(expect.not.arrayContaining([jobUUID]))
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
    expect(jobSystem.getRunning()).toEqual(expect.arrayContaining([jobUUIDtoStayFirst, jobUUIDtoStaySecond]));
});

