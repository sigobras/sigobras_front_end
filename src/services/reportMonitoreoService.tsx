import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';

export async function getReportData() {
  const res = await axios.get(`${UrlServer}/v1/reporteMonitoreoSeguimiento`);
  return res.data;
}

export async function addRow() {
  await axios.post(`${UrlServer}/v1/reporteMonitoreoSeguimiento`);
}

export async function updateData(id: number, data: { [key: string]: any }) {
  await axios.put(`${UrlServer}/v1/reporteMonitoreoSeguimiento/${id}`, data);
}
