declare type Configuration = {
    pinnedClass: string;
    movingClass?: string;
    pinnedBodyClass?: string;
    strategy: keyof typeof strategies;
    originalY: number;
    topMargin: number;
    pinSlop: number;
    throttle: number;
};
declare type Options = Partial<Configuration>;
declare const strategies: {
    relative: (target: HTMLElement, config: Configuration) => void;
    relativeWithHiding: (target: HTMLElement, config: Configuration) => void;
    fixed: (target: HTMLElement, config: Configuration) => void;
};
export declare const fixie: (el: HTMLElement, options: Options) => void;
export {};
