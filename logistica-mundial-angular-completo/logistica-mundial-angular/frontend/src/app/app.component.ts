import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Cliente, Ciudad, Dashboard, Envio, Paquete, Seguimiento, Transportadora, Vehiculo } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">LM</span><div><b>LOGÍSTICA</b><small>MUNDIAL</small></div></div>
      <p class="nav-label">MENÚ PRINCIPAL</p>
      <button [class.active]="seccion==='inicio'" (click)="ir('inicio')">▦ <span>Panel general</span></button>
      <button [class.active]="seccion==='envios'" (click)="ir('envios')">⇧ <span>Envíos</span></button>
      <button [class.active]="seccion==='clientes'" (click)="ir('clientes')">♙ <span>Clientes</span></button>
      <button [class.active]="seccion==='paquetes'" (click)="ir('paquetes')">▣ <span>Paquetes</span></button>
      <button [class.active]="seccion==='flota'" (click)="ir('flota')">▤ <span>Flota y empresas</span></button>
      <button [class.active]="seccion==='rastreo'" (click)="ir('rastreo')">⌖ <span>Seguimiento</span></button>
      <div class="sidebar-bottom"><span class="dot"></span> Sistema conectado</div>
    </aside>
    <main class="main">
      <header class="topbar"><div><span class="eyebrow">PLATAFORMA DE OPERACIONES</span><h1>{{titulo}}</h1></div><div class="user"><span class="avatar">A</span><div><b>Administrador</b><small>Operaciones</small></div></div></header>
      <div class="alert error" *ngIf="error">{{error}}</div>
      <div class="alert success" *ngIf="mensaje">{{mensaje}}</div>

      <section *ngIf="seccion==='inicio'">
        <div class="welcome"><div><span class="eyebrow light">CENTRO DE CONTROL</span><h2>Todo en movimiento.</h2><p>Supervisa la operación logística desde un solo lugar.</p></div><div class="welcome-icon">↗</div></div>
        <div class="stats">
          <article class="stat"><span>Envíos registrados</span><strong>{{dashboard?.envios ?? '—'}}</strong><small>Total acumulado</small></article>
          <article class="stat"><span>Clientes</span><strong>{{dashboard?.clientes ?? '—'}}</strong><small>Personas y empresas</small></article>
          <article class="stat"><span>Paquetes</span><strong>{{dashboard?.paquetes ?? '—'}}</strong><small>Unidades registradas</small></article>
          <article class="stat"><span>Transportadoras</span><strong>{{dashboard?.transportadoras ?? '—'}}</strong><small>Aliados logísticos</small></article>
        </div>
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">ACTIVIDAD</span><h3>Envíos recientes</h3></div><button class="outline" (click)="ir('envios')">Ver todos →</button></div>
          <div class="table-wrap"><table><thead><tr><th>NÚMERO</th><th>REMITENTE</th><th>DESTINATARIO</th><th>RUTA</th><th>ESTADO</th></tr></thead><tbody>
          <tr *ngFor="let e of envios.slice(0,5)"><td class="code">{{e.numero_envio}}</td><td>{{e.remitente}}</td><td>{{e.destinatario}}</td><td>{{e.ciudad_origen}} → {{e.ciudad_destino}}</td><td><span class="pill">{{e.estado}}</span></td></tr>
          <tr *ngIf="!envios.length"><td colspan="5" class="empty">No hay envíos disponibles.</td></tr></tbody></table></div>
        </div>
      </section>

      <section *ngIf="seccion==='envios'">
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">OPERACIÓN</span><h3>Registrar un envío</h3></div></div>
          <form class="form-grid" (ngSubmit)="guardarEnvio()">
            <label>Número de envío<input name="numero" [(ngModel)]="nuevoEnvio.numero_envio" placeholder="ENV-2026-003" required></label>
            <label>Remitente<select name="remitente" [(ngModel)]="nuevoEnvio.id_cliente_remitente" required><option [ngValue]="0">Seleccionar</option><option *ngFor="let c of clientes" [ngValue]="c.id_cliente">{{c.nombre}}</option></select></label>
            <label>Destinatario<select name="destinatario" [(ngModel)]="nuevoEnvio.id_cliente_destinatario" required><option [ngValue]="0">Seleccionar</option><option *ngFor="let c of clientes" [ngValue]="c.id_cliente">{{c.nombre}}</option></select></label>
            <label>Transportadora<select name="transportadora" [(ngModel)]="nuevoEnvio.id_transportadora" required><option [ngValue]="0">Seleccionar</option><option *ngFor="let t of transportadoras" [ngValue]="t.id_transportadora">{{t.nombre}}</option></select></label>
            <label>Ciudad origen<select name="origen" [(ngModel)]="nuevoEnvio.id_ciudad_origen" required><option [ngValue]="0">Seleccionar</option><option *ngFor="let c of ciudades" [ngValue]="c.id_ciudad">{{c.nombre}} · {{c.pais}}</option></select></label>
            <label>Ciudad destino<select name="destino" [(ngModel)]="nuevoEnvio.id_ciudad_destino" required><option [ngValue]="0">Seleccionar</option><option *ngFor="let c of ciudades" [ngValue]="c.id_ciudad">{{c.nombre}} · {{c.pais}}</option></select></label>
            <label>Dirección de origen<input name="dirOrigen" [(ngModel)]="nuevoEnvio.direccion_origen" required></label>
            <label>Dirección de destino<input name="dirDestino" [(ngModel)]="nuevoEnvio.direccion_destino" required></label>
            <label>Entrega estimada<input type="date" name="fecha" [(ngModel)]="nuevoEnvio.fecha_estimada_entrega"></label>
            <label>Costo (COP)<input type="number" min="0" name="costo" [(ngModel)]="nuevoEnvio.costo_total"></label>
            <div class="form-actions"><button class="primary" type="submit">＋ Crear envío</button></div>
          </form>
        </div>
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">REGISTRO</span><h3>Todos los envíos</h3></div><span class="count">{{envios.length}} registros</span></div>
          <div class="table-wrap"><table><thead><tr><th>NÚMERO</th><th>REMITENTE</th><th>DESTINATARIO</th><th>ORIGEN</th><th>DESTINO</th><th>ESTADO</th></tr></thead><tbody>
          <tr *ngFor="let e of envios"><td class="code">{{e.numero_envio}}</td><td>{{e.remitente}}</td><td>{{e.destinatario}}</td><td>{{e.ciudad_origen}}</td><td>{{e.ciudad_destino}}</td><td><span class="pill">{{e.estado}}</span></td></tr>
          </tbody></table></div>
        </div>
      </section>

      <section *ngIf="seccion==='clientes'">
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">DIRECTORIO</span><h3>Registrar cliente</h3></div></div>
          <form class="form-grid" (ngSubmit)="guardarCliente()">
            <label>Tipo<select name="tipo" [(ngModel)]="nuevoCliente.tipo_cliente"><option value="PERSONA">Persona</option><option value="EMPRESA">Empresa</option></select></label>
            <label>Nombre / razón social<input name="nombre" [(ngModel)]="nuevoCliente.nombre" required></label>
            <label>Documento / NIT<input name="documento" [(ngModel)]="nuevoCliente.documento" required></label>
            <label>Correo<input type="email" name="correo" [(ngModel)]="nuevoCliente.correo"></label>
            <label>Teléfono<input name="telefono" [(ngModel)]="nuevoCliente.telefono"></label>
            <label>Dirección<input name="direccion" [(ngModel)]="nuevoCliente.direccion"></label>
            <label>Ciudad<select name="ciudad" [(ngModel)]="nuevoCliente.id_ciudad" required><option [ngValue]="0">Seleccionar</option><option *ngFor="let c of ciudades" [ngValue]="c.id_ciudad">{{c.nombre}} · {{c.pais}}</option></select></label>
            <div class="form-actions"><button class="primary" type="submit">＋ Guardar cliente</button></div>
          </form>
        </div>
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">DIRECTORIO</span><h3>Clientes registrados</h3></div><span class="count">{{clientes.length}} registros</span></div>
          <div class="table-wrap"><table><thead><tr><th>NOMBRE</th><th>TIPO</th><th>DOCUMENTO</th><th>CIUDAD</th><th>CONTACTO</th></tr></thead><tbody><tr *ngFor="let c of clientes"><td>{{c.nombre}}</td><td>{{c.tipo_cliente}}</td><td class="code">{{c.documento}}</td><td>{{c.ciudad}}</td><td>{{c.telefono || c.correo || '—'}}</td></tr></tbody></table></div>
        </div>
      </section>

      <section *ngIf="seccion==='paquetes'">
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">INVENTARIO</span><h3>Paquetes registrados</h3></div><span class="count">{{paquetes.length}} unidades</span></div>
          <div class="table-wrap"><table><thead><tr><th>CÓDIGO</th><th>DESCRIPCIÓN</th><th>PESO</th><th>VALOR DECLARADO</th><th>ESTADO</th></tr></thead><tbody><tr *ngFor="let p of paquetes"><td class="code">{{p.codigo_rastreo}}</td><td>{{p.descripcion}}</td><td>{{p.peso_kg}} kg</td><td>{{p.valor_declarado | currency:'COP':'symbol-narrow':'1.0-0'}}</td><td><span class="pill">{{p.estado}}</span></td></tr></tbody></table></div>
        </div>
      </section>

      <section *ngIf="seccion==='flota'">
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">ALIADOS</span><h3>Transportadoras</h3></div></div><div class="table-wrap"><table><thead><tr><th>NOMBRE</th><th>SERVICIO</th><th>ESTADO</th></tr></thead><tbody><tr *ngFor="let t of transportadoras"><td>{{t.nombre}}</td><td>{{t.tipo_servicio}}</td><td><span class="pill">{{t.estado}}</span></td></tr></tbody></table></div></div>
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">VEHÍCULOS</span><h3>Flota registrada</h3></div></div><div class="table-wrap"><table><thead><tr><th>PLACA</th><th>TIPO</th><th>CAPACIDAD</th><th>TRANSPORTADORA</th><th>ESTADO</th></tr></thead><tbody><tr *ngFor="let v of vehiculos"><td class="code">{{v.placa}}</td><td>{{v.tipo}}</td><td>{{v.capacidad_kg}} kg</td><td>{{v.transportadora}}</td><td><span class="pill">{{v.estado}}</span></td></tr></tbody></table></div></div>
      </section>

      <section *ngIf="seccion==='rastreo'">
        <div class="panel"><div class="panel-head"><div><span class="eyebrow">TRAZABILIDAD</span><h3>Rastrear un envío</h3><p class="muted">Consulta los eventos asociados al número de envío.</p></div></div>
          <form class="track-form" (ngSubmit)="buscarSeguimiento()"><input name="rastreo" [(ngModel)]="numeroRastreo" placeholder="Ej. ENV-2026-001" required><button class="primary" type="submit">Buscar envío →</button></form>
          <div class="timeline" *ngIf="seguimientos.length"><div class="event" *ngFor="let s of seguimientos"><span class="event-dot"></span><div><b>{{s.estado}}</b><small>{{s.fecha_evento | date:'medium'}}</small><p>{{s.ubicacion}} · {{s.descripcion}}</p></div></div></div>
          <p class="empty" *ngIf="busquedaHecha && !seguimientos.length">No se encontraron eventos para ese número.</p>
        </div>
      </section>
      <footer>LOGÍSTICA MUNDIAL <span>·</span> Plataforma de gestión de transporte y distribución</footer>
    </main>
  </div>
  `
})
export class AppComponent implements OnInit {
  seccion = 'inicio';
  dashboard: Dashboard | null = null;
  envios: Envio[] = [];
  clientes: Cliente[] = [];
  paquetes: Paquete[] = [];
  transportadoras: Transportadora[] = [];
  vehiculos: Vehiculo[] = [];
  ciudades: Ciudad[] = [];
  seguimientos: Seguimiento[] = [];
  numeroRastreo = '';
  busquedaHecha = false;
  error = '';
  mensaje = '';
  nuevoEnvio: any = { numero_envio:'',id_cliente_remitente:0,id_cliente_destinatario:0,id_transportadora:0,id_ciudad_origen:0,id_ciudad_destino:0,direccion_origen:'',direccion_destino:'',fecha_estimada_entrega:'',costo_total:0 };
  nuevoCliente: any = { tipo_cliente:'PERSONA',nombre:'',documento:'',correo:'',telefono:'',direccion:'',id_ciudad:0 };
  constructor(private api: ApiService) {}
  get titulo(): string {
    return ({inicio:'Panel general',envios:'Gestión de envíos',clientes:'Gestión de clientes',paquetes:'Gestión de paquetes',flota:'Flota y transportadoras',rastreo:'Seguimiento de envíos'} as any)[this.seccion];
  }
  ngOnInit(): void { this.cargarTodo(); }
  ir(s: string): void { this.seccion=s; this.error=''; this.mensaje=''; }
  cargarTodo(): void {
    this.api.dashboard().subscribe({next:v=>this.dashboard=v,error:e=>this.mostrarError(e)});
    this.api.envios().subscribe({next:v=>this.envios=v,error:e=>this.mostrarError(e)});
    this.api.clientes().subscribe({next:v=>this.clientes=v,error:e=>this.mostrarError(e)});
    this.api.paquetes().subscribe({next:v=>this.paquetes=v,error:e=>this.mostrarError(e)});
    this.api.transportadoras().subscribe({next:v=>this.transportadoras=v,error:e=>this.mostrarError(e)});
    this.api.vehiculos().subscribe({next:v=>this.vehiculos=v,error:e=>this.mostrarError(e)});
    this.api.ciudades().subscribe({next:v=>this.ciudades=v,error:e=>this.mostrarError(e)});
  }
  guardarEnvio(): void {
    this.api.crearEnvio(this.nuevoEnvio).subscribe({next:r=>{this.mensaje=r.message;this.error='';this.nuevoEnvio={numero_envio:'',id_cliente_remitente:0,id_cliente_destinatario:0,id_transportadora:0,id_ciudad_origen:0,id_ciudad_destino:0,direccion_origen:'',direccion_destino:'',fecha_estimada_entrega:'',costo_total:0};this.api.envios().subscribe(v=>this.envios=v);this.api.dashboard().subscribe(v=>this.dashboard=v);},error:e=>this.mostrarError(e)});
  }
  guardarCliente(): void {
    this.api.crearCliente(this.nuevoCliente).subscribe({next:r=>{this.mensaje=r.message;this.error='';this.nuevoCliente={tipo_cliente:'PERSONA',nombre:'',documento:'',correo:'',telefono:'',direccion:'',id_ciudad:0};this.api.clientes().subscribe(v=>this.clientes=v);this.api.dashboard().subscribe(v=>this.dashboard=v);},error:e=>this.mostrarError(e)});
  }
  buscarSeguimiento(): void {
    this.busquedaHecha=true;this.seguimientos=[];
    this.api.seguimiento(this.numeroRastreo.trim()).subscribe({next:v=>this.seguimientos=v,error:e=>this.mostrarError(e)});
  }
  mostrarError(e: any): void { this.error=e?.error?.message || 'No fue posible conectar con la API. Verifica que MySQL y el backend estén activos.'; }
}
