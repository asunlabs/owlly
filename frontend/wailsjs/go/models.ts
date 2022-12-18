export namespace config {
	
	export class ModelEnvBot {
	    triggerName: string;
	    slackBotOauthToken: string;
	    slackChannelID: string;
	    slackUserID: string;
	    slackUserName: string;
	
	    static createFrom(source: any = {}) {
	        return new ModelEnvBot(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.triggerName = source["triggerName"];
	        this.slackBotOauthToken = source["slackBotOauthToken"];
	        this.slackChannelID = source["slackChannelID"];
	        this.slackUserID = source["slackUserID"];
	        this.slackUserName = source["slackUserName"];
	    }
	}

}

