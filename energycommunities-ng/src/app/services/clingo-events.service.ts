import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClingoEventsService {

  private eventSource?: EventSource;

  connect(callback: (eventName: string) => void) {
    this.eventSource = new EventSource('http://localhost:8080/clingo-stream/events');

    this.eventSource.addEventListener('GROUNDING_STARTED', () => {
      callback('GROUNDING_STARTED');
    });

    this.eventSource.addEventListener('GROUNDING_FINISHED', () => {
      callback('GROUNDING_FINISHED');
    });

    this.eventSource.addEventListener('GROUNDING_STILL_RUNNING', () => {
      callback('GROUNDING_STILL_RUNNING');
    });
  }

  disconnect() {
    this.eventSource?.close();
  }
}
