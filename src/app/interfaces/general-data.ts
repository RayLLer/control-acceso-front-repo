export interface IGeneralConfig {
    fiftyMaxQty: number;
    clueMaxQty: number;
    ruleOutMaxQty: number;
    twoAnswersQty: number;
    adminEmail: string;
    practicalTestCorrectAnswerValue: number;
    practicalTestIncorrectAnswerValue: number;
    standarTestCorrectAnswerValue: number;
    standarTestIncorrectAnswerValue: number;
}

export interface IGeneralConfigResponse {
    id: number;
    attributes: IGeneralConfig
}