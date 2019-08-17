import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public ApiUrl = 'https://api.tqworksng.com/api/';
    public devApiUrl = 'https://devapi.tqworksng.com/api/'; //http://localhost:81/mbd-api/
    public webUrl = 'http://myboarddeals.com/';
    public localUrl = 'http://localhost:8000/';
}
