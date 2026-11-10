import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, Ciudad, Dashboard, Envio, Paquete, Seguimiento, Transportadora, Vehiculo } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}
  dashboard(): Observable<Dashboard> { return this.http.get<Dashboard>(`${this.base}/dashboard`); }
  envios(): Observable<Envio[]> { return this.http.get<Envio[]>(`${this.base}/envios`); }
  crearEnvio(data: object): Observable<any> { return this.http.post(`${this.base}/envios`, data); }
  clientes(): Observable<Cliente[]> { return this.http.get<Cliente[]>(`${this.base}/clientes`); }
  crearCliente(data: object): Observable<any> { return this.http.post(`${this.base}/clientes`, data); }
  paquetes(): Observable<Paquete[]> { return this.http.get<Paquete[]>(`${this.base}/paquetes`); }
  transportadoras(): Observable<Transportadora[]> { return this.http.get<Transportadora[]>(`${this.base}/transportadoras`); }
  vehiculos(): Observable<Vehiculo[]> { return this.http.get<Vehiculo[]>(`${this.base}/vehiculos`); }
  ciudades(): Observable<Ciudad[]> { return this.http.get<Ciudad[]>(`${this.base}/ciudades`); }
  seguimiento(numero: string): Observable<Seguimiento[]> { return this.http.get<Seguimiento[]>(`${this.base}/seguimientos/${encodeURIComponent(numero)}`); }
  vistaEnvios(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/vista-envios`); }
}
