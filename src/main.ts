import 'zone.js/dist/zone';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { BatchInterceptor } from '@mswjs/interceptors';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <p><button (click)="xhrRequest()">Send XHR</button></p>
    <p><button (click)="angularRequest()">Send Angular request</button></p>
    <p><button (click)="fetchRequest()">Send fetch request</button></p>
  `,
})
export class App {
  constructor(private httpClient: HttpClient) {}

  api = 'https://jsonplaceholder.typicode.com/todos/1';

  xhrRequest(): void {
    console.log(
      '============== XHR [APPLICATION REQUEST INITIATED] =============='
    );
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(
          '============== XHR [APPLICATION RESPONSE RECIEVED] =============='
        );
        console.log(data);
      }
    };

    xhr.open('GET', this.api, true);
    xhr.send();
  }

  angularRequest() {
    console.log(
      '============== Angular [APPLICATION REQUEST INITIATED] =============='
    );
    this.httpClient.get(this.api).subscribe({
      next: (res) => {
        console.log(
          '============== Angular [APPLICATION RESPONSE RECIEVED] =============='
        );
      },
      error: (err) => {},
    });
  }

  fetchRequest() {
    console.log(
      '============== fetch [APPLICATION REQUEST INITIATED] =============='
    );
    fetch(this.api).then((res) => {
      console.log(
        '============== fetch [APPLICATION RESPONSE RECIEVED] =============='
      );
    });
  }
}

bootstrapApplication(App).then(() => {
  console.log('App bootstrapped, registering intereptors');

  let interceptor = new BatchInterceptor({
    name: 'my-interceptor',
    interceptors: [new XMLHttpRequestInterceptor(), new FetchInterceptor()],
  });
  interceptor.dispose();

  interceptor.apply();

  console.log('Registering REQUEST interceptors...');

  [1, 2, 3].forEach((i) => {
    interceptor.on('request', () => {
      console.log(`[REQUEST interceptor ${i}]`);
    });
  });

  console.log('Registering REPONSE interceptors...');

  [1, 2, 3].forEach((i) => {
    interceptor.on('response', () => {
      console.log(`[RESPONSE interceptor ${i}]`);
    });
  });
});
