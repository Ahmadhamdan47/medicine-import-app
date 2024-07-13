// jsgrid.d.ts
declare module 'jsgrid' {
    interface Field {
        name: string;
        type: string;
        width?: number;
        title?: string;
        editing?: boolean;
        inserting?: boolean;
        filtering?: boolean;
        align?: string;
        css?: string;
        headercss?: string;
        itemTemplate?: (value: any, item: any) => string | HTMLElement;
        insertTemplate?: () => string | HTMLElement;
        editTemplate?: (value: any, item: any) => string | HTMLElement;
        filterTemplate?: () => string | HTMLElement;
        insertValue?: () => any;
        editValue?: () => any;
        filterValue?: () => any;
        validate?: any;
        sorter?: string | ((a: any, b: any) => number);
    }

    interface Config {
        width?: string;
        height?: string;
        inserting?: boolean;
        editing?: boolean;
        sorting?: boolean;
        paging?: boolean;
        autoload?: boolean;
        pageLoading?: boolean;
        pageIndex?: number;
        pageSize?: number;
        pageButtonCount?: number;
        pagerFormat?: string;
        pagePrevText?: string;
        pageNextText?: string;
        pageFirstText?: string;
        pageLastText?: string;
        loadIndication?: boolean;
        loadIndicationDelay?: number;
        loadMessage?: string;
        loadShading?: boolean;
        confirmDeleting?: boolean;
        deleteConfirm?: string;
        noDataContent?: string | HTMLElement;
        controller?: any;
        loadStrategy?: any;
        loadIndicationZIndex?: number;
        invalidMessage?: string;
        fields: Field[];
        data?: any[];
        rowClass?: (item: any, itemIndex: number) => string;
        onInit?: (args: { grid: any }) => void;
        onDataLoading?: (args: { grid: any }) => void;
        onDataLoaded?: (args: { grid: any, data: any }) => void;
        onRefreshing?: (args: { grid: any }) => void;
        onRefreshed?: (args: { grid: any }) => void;
        onPageChanged?: (args: { grid: any, pageIndex: number }) => void;
        onItemDeleting?: (args: { grid: any, item: any }) => void;
        onItemDeleted?: (args: { grid: any, item: any }) => void;
        onItemUpdating?: (args: { grid: any, item: any }) => void;
        onItemUpdated?: (args: { grid: any, item: any }) => void;
        onItemInserting?: (args: { grid: any, item: any }) => void;
        onItemInserted?: (args: { grid: any, item: any }) => void;
        onItemInvalid?: (args: { grid: any, item: any, itemIndex: number, rule: string }) => void;
        invalidNotify?: (args: { grid: any, errors: any[] }) => void;
    }

    interface Static {
        (element: HTMLElement, config: Config): any;
    }

    const jsGrid: Static;

    export = jsGrid;
}

interface JQuery {
    jsGrid(config: jsGrid.Config): JQuery;
    jsGrid(method: string, ...args: any[]): any;
}
