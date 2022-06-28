# gh-action-szum-tech

> Github
>
>![GitHub release (latest by date)](https://img.shields.io/github/v/release/JanSzewczyk/gh-action-szum-tech)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/JanSzewczyk/gh-action-szum-tech)](https://github.com/JanSzewczyk/eslint-config-szum-tech/pulls)
[![GitHub issues](https://img.shields.io/github/issues/JanSzewczyk/gh-action-szum-tech)](https://github.com/JanSzewczyk/eslint-config-szum-tech/issues)
![GitHub Repo stars](https://img.shields.io/github/stars/JanSzewczyk/gh-action-szum-tech?style=social)

> Github Actions
>
>[![🚀 publish](https://github.com/JanSzewczyk/gh-action-szum-tech/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/JanSzewczyk/eslint-config-szum-tech/actions/workflows/publish.yml)
[![test](https://github.com/JanSzewczyk/gh-action-szum-tech/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/JanSzewczyk/eslint-config-szum-tech/actions/workflows/test.yml)
[![CodeQL](https://github.com/JanSzewczyk/gh-action-szum-tech/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/JanSzewczyk/eslint-config-szum-tech/actions/workflows/codeql.yml)
[![Eslint](https://github.com/JanSzewczyk/gh-action-szum-tech/actions/workflows/eslint.yml/badge.svg?branch=main)](https://github.com/JanSzewczyk/eslint-config-szum-tech/actions/workflows/codeql.yml)


## Actions

### Jest Test Results

#### Inputs

| Parameter          | Is Required | Default             | Description                                                                                                                                                              |
|--------------------|-------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GITHUB_TOKEN`     | true        | N/A                 | Used for the GitHub Checks API.  Value is generally: secrets.GITHUB_TOKEN.                                                                                               |
| `RESULTS_FILE`     | false       | `jest-results.json` | File name with Jest testing result.                                                                                                                                      |
| `PR_COMMENT`       | false       | `true`              | Flag indicating whether a PR comment should be generated with the test results. If the value is `true`, the default behavior is to add or update an existing PR comment. |
| `STATUS_CHECK`     | false       | `true`              | Flag indicating whether a status check with test results should be generated.                                                                                            |

#### Outputs

| Output |  Default            | Description                                                                                                                                                              |
|--------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|        |                     |                                                                                                                                                                          |

#### Usage Examples

##### Using defaults

##### Specifying additional behavior

## Work in progress: 

### Actions: 
`labels`
- [ ] add ability to define custom `label configuration`
- [ ] docs
- [ ] tests
- [ ] update `labels/action.yml` file
 
`jest-test-results`
- [ ] docs
- [ ] tests

### Utils: 
`github-message-builder`
- [ ] change imports 
- [ ] finish tests
- [ ] improve already existed usages 

## License

MIT © Szum-Tech
