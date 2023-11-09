export interface UserKeycloak {
    access_token:        string;
    expires_in:          number;
    refresh_expires_in:  number;
    refresh_token:       string;
    token_type:          string;
    not_before_policy: 	 number;
    session_state:       string;
    scope:               string;
}

export interface TokenDecode {
	acr: string;
	allowedorigins?: any;
	aud: any;
	auth_time: number;
	azp: string;
	email_verified: boolean;
	name:string,
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	locale: string;
	given_name:string;
	nbf: 0
	preferred_username: string;
	realm_access: any;
	resource_access: any;
	ADP: any;
	account: any;
	ams_apps: any;
	parametricas: any;
	prestaciones: any;
	prestadores: any;
	__proto__: Object;
	scope: string;
	session_state: string;
	sub: string;
	typ: string;
}

export interface User {
    name: string;
    roles: string[];
	fullName:string;
    emailVerify: boolean;
	expToken:number;
	token:string;
}
