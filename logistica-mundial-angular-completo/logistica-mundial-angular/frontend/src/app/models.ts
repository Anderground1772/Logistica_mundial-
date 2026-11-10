export interface Dashboard {
  envios: number; clientes: number; paquetes: number; transportadoras: number;
  estados: { estado: string; cantidad: number }[];
}
export interface Envio {
  id_envio: number; numero_envio: string; estado: string; fecha_registro: string;
  fecha_estimada_entrega: string | null; costo_total: number; remitente: string;
  destinatario: string; ciudad_origen: string; ciudad_destino: string;
}
export interface Cliente {
  id_cliente: number; tipo_cliente: string; nombre: string; documento: string;
  correo: string | null; telefono: string | null; direccion: string | null;
  id_ciudad: number; ciudad: string;
}
export interface Paquete {
  id_paquete: number; codigo_rastreo: string; descripcion: string; peso_kg: number;
  estado: string; valor_declarado: number;
}
export interface Transportadora {
  id_transportadora: number; nombre: string; tipo_servicio: string; estado: string;
}
export interface Vehiculo {
  id_vehiculo: number; placa: string; tipo: string; capacidad_kg: number;
  estado: string; transportadora: string;
}
export interface Ciudad { id_ciudad: number; nombre: string; pais: string; }
export interface Seguimiento {
  numero_envio: string; estado_envio: string; fecha_evento: string;
  ubicacion: string; estado: string; descripcion: string;
}
