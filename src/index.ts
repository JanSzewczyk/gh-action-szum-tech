import {getInput} from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {main as runLabel} from './label'
import {GithubContext, GithubContextPayloadPullRequest} from "./types";


const inputName = getInput('name');
const githubToken = getInput('GITHUB_TOKEN');

greet(inputName, getRepositoryUrl(context))

runLabel(githubToken);

getDiff().then(res => {
    // console.log(dedent(`
    //     Your PR diff:
    //     ${JSON.stringify(res, undefined, 2 )}
    // `))
})

getPreviousPRComments().then(res => {
    console.log('comments', JSON.stringify(res, undefined, 2))
})

console.log('--- Action Info ---')
console.log('eventName:', context.eventName)
console.log('sha:', context.sha)
console.log('ref:', context.ref)
console.log('workflow:', context.workflow)
console.log('action:', context.action)
console.log('actor:', context.actor)
console.log('job:', context.job)
console.log('runNumber:', context.runNumber)
console.log('runId:', context.runId)
console.log('apiUrl:', context.apiUrl)
console.log('serverUrl:', context.serverUrl)
console.log('graphqlUrl:', context.graphqlUrl)
console.log('-------------------')

console.log('--- Payload ---')
console.log(JSON.stringify(context.payload.action, undefined, 2))
console.log('---------------')
console.log(JSON.stringify(context.payload.comment, undefined, 2))
console.log('---------------')
console.log(JSON.stringify(context.payload.pull_request, undefined, 2))
console.log('---------------')

function greet(name: string, repoUrl: string) {
    console.log(`Hello ${name}!! You are running a GH action in ${repoUrl}`);
}

function getRepositoryUrl({repo, serverUrl}: GithubContext): string {
    return `${serverUrl}/${repo.owner}/${repo.repo}`
}

async function getDiff() {
    const octokit = getOctokit(githubToken);

    const result = await octokit.rest.repos.compareCommits({
        repo: context.repo.repo,
        owner: context.repo.owner,
        head: context.payload.pull_request?.head.sha,
        base: context.payload.pull_request?.base.sha,
        per_page: 100
    })

    return result.data.files || [];
}

async function getPreviousPRComments() {
    const pullRequest: GithubContextPayloadPullRequest = context.payload.pull_request;

    if (pullRequest) {

        const octokit = getOctokit(githubToken);

        const result = await octokit.rest.pulls.listReviews({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pullRequest.number,
        });

        console.log('jestem to', result)
        return result.data;

    }

    return []
}