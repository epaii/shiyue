/// <reference types="node" />
import { ResponseOriginData } from "../server/types";
import http from "http";
export declare function JsonResponseBodyAdvice(data: ResponseOriginData, res: http.ServerResponse): void;
