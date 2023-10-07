import { ResponseOriginData } from "../server/types";
import http from "http";

export function JsonResponseBodyAdvice(data: ResponseOriginData, res: http.ServerResponse) {
    res.setHeader('Content-Type', 'application/json;charset:utf-8');
    if (data.success) data.code = 1;
    res.end(JSON.stringify(data));
}