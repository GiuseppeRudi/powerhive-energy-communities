import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClingoEventsService {

  private eventSource?: EventSource;

  connect(callback: (eventName: string, analysisId: number) => void) {
    this.eventSource = new EventSource('http://localhost:8080/clingo-stream/events');

    this.eventSource.addEventListener('GROUNDING_STARTED', (event: MessageEvent) => {
      const analysisId = Number(event.data);
      callback('GROUNDING_STARTED', analysisId);
    });

    this.eventSource.addEventListener('GROUNDING_FINISHED', (event: MessageEvent) => {
      const analysisId = Number(event.data);
      callback('GROUNDING_FINISHED', analysisId);
    });

    this.eventSource.addEventListener('GROUNDING_STILL_RUNNING', (event: MessageEvent) => {
      const analysisId = Number(event.data);
      callback('GROUNDING_STILL_RUNNING', analysisId);
    });

    this.eventSource.addEventListener('FINISHED', (event: MessageEvent) => {
      const analysisId = Number(event.data);
      callback('FINISHED', analysisId);
    });

    this.eventSource.addEventListener('ERROR', (event: MessageEvent) => {
      const analysisId = Number(event.data);
      callback('ERROR', analysisId);
    });
  }

  disconnect() {
    this.eventSource?.close();
  }
}
