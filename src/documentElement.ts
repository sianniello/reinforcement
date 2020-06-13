import { Tensor } from "@tensorflow/tfjs";

export const getElementByName = <T extends HTMLElement>(name: string) =>
    document.getElementsByName(name) as NodeListOf<T>;

export const getElementById = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

export const getElementsByType = (type: string) => document.querySelectorAll(`[type=${type}]`);

export const getElementByClass = <T extends HTMLElement>(c: string) =>
     Array.from(document.getElementsByClassName(c)) as T[]