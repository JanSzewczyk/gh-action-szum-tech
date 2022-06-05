import {getOctokit, context} from '@actions/github'
import {setFailed} from '@actions/core'
import {GithubContextPayloadPullRequest} from "../types";

export async function main(githubToken: string) {
    try {
        /**
         * Now we need to create an instance of Octokit which will use to call
         * GitHub's REST API endpoints.
         * We will pass the token as an argument to the constructor. This token
         * will be used to authenticate our requests.
         * You can find all the information about how to use Octokit here:
         * https://octokit.github.io/rest.js/v18
         **/
        const octokit = getOctokit(githubToken);
        const pullRequest: GithubContextPayloadPullRequest = context.payload.pull_request;

        if (!pullRequest) {
            new Error("Pull Request doesn't exists!!!")
            return;
        }

        /**
         * We need to fetch the list of files that were changes in the Pull Request
         * and store them in a variable.
         * We use octokit.paginate() to automatically loop over all the pages of the
         * results.
         * Reference: https://octokit.github.io/rest.js/v18#pulls-list-files
         */
        const {data: changedFiles} = await octokit.rest.pulls.listFiles({
            ...context.repo,
            pull_number: pullRequest.number,
        });


        /**
         * Contains the sum of all the additions, deletions, and changes
         * in all the files in the Pull Request.
         **/
        let diffData = {
            additions: 0,
            deletions: 0,
            changes: 0
        };

        // Reference for how to use Array.reduce():
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        diffData = changedFiles.reduce((acc, file) => {
            acc.additions += file.additions;
            acc.deletions += file.deletions;
            acc.changes += file.changes;
            return acc;
        }, diffData);

        /**
         * Loop over all the files changed in the PR and add labels according
         * to files types.
         **/
        for (const file of changedFiles) {
            /**
             * Add labels according to file types.
             */
            const fileExtension = file.filename.split('.').pop();

            console.log(`
                Label: 
                File extension : ${fileExtension}
            `)

            switch (fileExtension) {
                case 'md':
                    await octokit.rest.issues.addLabels({
                        ...context.repo,
                        issue_number: pullRequest.number,
                        labels: ['markdown'],
                    });
                case 'js':
                    await octokit.rest.issues.addLabels({
                        ...context.repo,
                        issue_number: pullRequest.number,
                        labels: ['javascript'],
                    });
                case 'yml':
                    await octokit.rest.issues.addLabels({
                        ...context.repo,
                        issue_number: pullRequest.number,
                        labels: ['yaml'],
                    });
                case 'yaml': {
                    await octokit.rest.issues.addLabels({
                        ...context.repo,
                        issue_number: pullRequest.number,
                        labels: ['yaml'],
                    });
                }
            }
        }

        /**
         * Create a comment on the PR with the information we compiled from the
         * list of changed files.
         */
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: pullRequest.number,
            body: `
        Pull Request #${pullRequest.number} has been updated with: \n
        - ${diffData.changes} changes \n
        - ${diffData.additions} additions \n
        - ${diffData.deletions} deletions \n
      `
        });
    } catch (error: any) {
        setFailed(error.message);
    }
}