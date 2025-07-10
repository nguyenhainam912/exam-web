import data from '@/utils/data';
import type { IColumn } from '@/utils/interfaces';
import { formatterMoney, toRegex } from '@/utils/utils';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Input, Modal, Table } from 'antd';
import type { PaginationProps } from 'antd/es/pagination';
import type { FilterValue } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { ReactNode, useEffect } from 'react';
// import styled from 'styled-components';
import type {GetRowKey} from "rc-table/lib/interface";
import { getStore } from '@/stores';


type Props = {
  storeName?: any;
  Form?: React.FC;
  formType?: 'Modal' | 'Drawer';
  columns: IColumn<any>[];
  title?: React.ReactNode;
  getData?: Function;
  dependencies?: any[];
  loading: boolean;
  params?: any;
  children?: React.ReactNode;
  border?: boolean;
  scroll?: any;
  widthDrawer?: string;
  hascreate?: boolean;
  dataState?: string;
  footer?: any;
  summary?: (data: readonly any[]) => ReactNode;
  isNotPagination?: boolean;
  onCloseForm?: () => void;
  visibleState?: string;
  setVisibleState?: string;
  className?: string;
  cardClassName?: string;
  tableClassName?: string;
  locale?: any,
  bodyStyle?: any;
  totalState?: number;
  dataSource?: any[];
  titleHeaderTable?: string;
  rowKey?: string | GetRowKey<any>;
  tableComponents?: any;
  defaultExpandAllRows?:boolean
  rowSelection?: any
  expandable?: any
    // expandIcon?: ({ expanded, onExpand, record }: any) => ReactNode
    // expandedRowRender?: any
    // rowExpandable?: (record: any) => boolean
    // defaultExpandedRowKeys?: string[]
    // showExpandColumn?: boolean
  
  rowClassName?: any;
  titleForm?: any;
  drawerExtra?: React.ReactNode,
  size?: 'small' | 'middle' | 'large',
  drawerFooter?: ReactNode,
  hasDrawerFooter?: boolean,
  propsDrawer?: any
};

// const TableWrapper = styled.div`
//   .ant-table-filter-trigger.active {
//     color: white !important;
//   }
//   .ant-table-column-sorter-up.active,
//   .ant-table-column-sorter-down.active {
//     color: white !important;
//   }
// `;

const TableBase = (props: Props) => {
  const {
    storeName,
    Form,
    title,
    getData,
    dependencies = [],
    formType,
    loading,
    children,
    params,
    border,
    bodyStyle,
    scroll,
    widthDrawer,
    hascreate,
    dataState,
    footer,
    summary,
    isNotPagination,
    visibleState,
    setVisibleState,
    tableClassName,
    locale,
    cardClassName,
    tableComponents,
    dataSource,
    rowKey,
    onCloseForm,
    titleHeaderTable,
    rowSelection,
    expandable,
    rowClassName,
    titleForm,
    drawerExtra,
    size,
    drawerFooter,
    hasDrawerFooter,
    propsDrawer
  } = props;
  let { columns } = props;
  const store = getStore(storeName);
  const {
    view,
    edit,
    total,
    page,
    limit,
    setPage,
    setLimit,
    filterInfo,
    cond,
    setFilterInfo,
    setCondition,
    setVisibleForm,
    visibleForm,
    setEdit,
    setIsCreate,
    setView,
    setRecord,
    setLoading,
  } = store();
  // useEffect(() => {
  //   if (typeof getData !== "undefined"){
  //     setLoading(true)
  //     getData(params);
  //     setLoading(false)
  //   } else {setLoading(false)}
  // }, [...dependencies]);
  let searchInput: Input | null = null;
  const getCondValue = (dataIndex: any) => {
    const type = typeof dataIndex;
    return filterInfo?.[type === 'string' ? dataIndex : dataIndex?.join('.')] ?? [];
  };

  const getSortStatus = (dataIndex: any) => {
    const type = typeof dataIndex;
    return filterInfo?.sort?.[type === 'string' ? dataIndex : dataIndex?.join('.')] ?? [];
  };
  const haveCond = (dataIndex: string) => getCondValue(dataIndex).length > 0;

  const getSearch = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: Function;
      selectedKeys: string[];
      confirm: Function;
      clearFilters: Function;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          // placeholder={intl.formatMessage({id: "common.buttons.timKiem"})}
          value={selectedKeys[0]} //  || selectedKeys[0]
          onChange={(e) =>
            setSelectedKeys(
              e.target.value
                ? // ? [e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')]
                  [e.target.value]
                : [],
            )
          }
          onPressEnter={() => confirm()}
          style={{
            width: 188,
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            confirm();
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          {/* {intl.formatMessage({id: "common.buttons.timKiem"})} */}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            const tmpCond = _.clone(cond);
            const type = typeof dataIndex;
            delete tmpCond[type === 'string' ? dataIndex : dataIndex?.join('.')];
            const tmpFilter = _.clone(filterInfo);
            delete tmpFilter[type === 'string' ? dataIndex : dataIndex?.join('.')];
            setFilterInfo(tmpFilter);
            setCondition(tmpCond);
          }}
          size="small"
          style={{ width: 90 }}
        >
          {/* {intl.formatMessage({id: "common.buttons.xoa"})} */}
        </Button>
      </div>
    ),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select());
      }
    },
    filteredValue: getCondValue(dataIndex),
    onFilter: () => true,
    filterIcon: (filtered: any) => (
      <SearchOutlined
        style={{
          color: filtered || haveCond(dataIndex) ? '#1890ff' : undefined,
        }}
        // title={intl.formatMessage({id: "common.buttons.timKiem"})}
      />
    ),
  });

  const getSortValue = (dataIndex: any) => {
    let value = getSortStatus(dataIndex);
    if (value === 1) {
      return 'ascend';
    }
    if (value === -1) {
      return 'descend';
    }
    return false;
  };

  const getSort = (dataIndex: any) => ({
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    sortOrder: getSortValue(dataIndex),
  });

  const getFilter = (dataIndex: any, columnKey?: string) => {
    const newDataIndex = dataIndex?.join('.');
    const arrValueByDataIndex: any[] = data?.[`${columnKey || newDataIndex}`] ?? [];
    return {
      // cần đảm bảo trong file data.js đã có dữ liệu
      filters: arrValueByDataIndex.map((item, index) => {
        const type = typeof item;
        return {
          text: type === 'string' ? item : item?.text ?? '',
          value: type === 'string' ? index : item?.value,
        };
      }),
      onFilter: () => true,
      // đồng bộ với cond đang search
      filteredValue: getCondValue(newDataIndex),
      filterMultiple: false,
      // render: (item: string | number) => {
      //   return data?.[`${columnKey || newDataIndex}`]?.[`${+item}`] ?? 'Chưa xác định';
      // },
    };
  };

  const getFilterS = (dataIndex: any, columnKey: any) => ({
    // cần đảm bảo trong file data.js đã có dữ liệu
    // trangThaiDon  = [ 'Đang xử lý', 'Đã xử lý']
    // dataIndex : 'trangThaiHienThi'
    // columnKey :'trangThaiDon'
    filters: (data?.[columnKey || dataIndex] ?? []).map((item: any) => {
      const type = typeof item?.tenDonVi;
      return {
        text: type === 'string' ? item?.tenDonVi : item?.text ?? '', // cai hien thi ở ô lọc
        value: type === 'string' ? item?.donViId : item?.value,
      };
    }),
    onFilter: () => true,
    // đồng bộ với cond đang search
    filteredValue: getCondValue(dataIndex),
    filterMultiple: false,
    // render: (item: string | number) => item ?? 'Chưa xác định',
  });

  columns = columns.map((item) => {
    // nếu data trả về có dạng 0,1 / true,false
    if (item.search === 'filter') {
      return {
        ...item,
        ...getFilter(item.dataIndex, item?.columnKey),
      };
    }
    // nếu data trả về có dạng string
    if (item.search === 'filterString') {
      return {
        ...item,
        ...getFilterS(item.dataIndex, item?.columnKey),
      };
    }
    if (item.search === 'search') {
      return { ...item, ...getSearch(item.dataIndex) };
    }
    if (item.search === 'sort') {
      return { ...item, ...getSort(item.dataIndex) };
    }
    return item;
  });

  const handleTableChange = (
    pagination: PaginationProps,
    filters: Record<string, FilterValue | null>,
    sorter: any,
  ) => {
    // this.tableBaseRef.current.focus();
    // this.focusTableBase();
    // thay đổi từ phân trang || filter
    const { current, pageSize } = pagination;
    const { field, order } = sorter;
    let orderValue = undefined;
    if (order === 'ascend') orderValue = 1;
    else if (order === 'descend') orderValue = -1;
    //  giữ lại thông tin của cond.
    const tmpCond = _.clone(cond);
    Object.keys(filters).forEach((key) => {
      // if (!filters?.[key]?.length) {
      //   return;
      // }
      const notRegex = columns?.find(
        (item) => item.dataIndex === key || item.key === key,
      )?.notRegex;
      const value = filters?.[key]?.[0];
      const isSearch = typeof value === 'string';
      tmpCond[key] = isSearch && notRegex !== true ? value : value;
      // return 0;
    });
    let tmpSort = {
      ...filterInfo?.sort,
    };
    if (orderValue) {
      tmpSort = {
        ...tmpSort,
        [`${field}`]: orderValue,
      };
    } else {
      delete tmpSort[`${field}`];
    }

    setFilterInfo({
      ...filterInfo,
      ...filters,
      sort: tmpSort,
    });
    setPage(current);
    setLimit(pageSize);
    setCondition(tmpCond);
  };
  return (
    <div className={cardClassName} style={{ body: props.bodyStyle }}>
      {children}
      {hascreate && (
        <Button
          style={{ marginBottom: '10px' }}
          onClick={() => {
            setVisibleForm(true);
            setEdit(false);
            setRecord({});
          }}
          icon={<PlusCircleFilled />}
          type="primary"
        >
          Thêm mới
        </Button>
      )}
      <div >
        {titleHeaderTable && (
          <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>{titleHeaderTable}</p>
        )}
        <Table
          className={tableClassName}
          loading={loading}
          components={tableComponents}
          bordered={border || false}
            pagination={
              isNotPagination
                ? false
                : {
                    current: page,
                    pageSize: storeName !== "initialManager" ? limit : 10,
                    position: ['bottomRight'],
                    total: props.totalState ? props.totalState : total,
                    showSizeChanger: true,
                    pageSizeOptions: ['1', '10', '25', '50', '100'],
                  showTotal: () => {
                    return <div style={{flex: '1', display: 'flex', justifyContent: storeName === "contract" ? 'space-between' : 'flex-end', gap: '20px'}}>
                     {storeName === "contract" && <h4>
                        Tổng giá trị hợp đồng trước thuế theo tháng:
                        <Input
                          style={{ width: '150px', fontWeight: 700, fontSize: 16, marginLeft: 10 }}
                          value={formatterMoney(10000000)}
                        />
                      </h4>}
                      <div>Tổng số: {props.totalState ? props.totalState : total ?? 0}</div>
                    </div>;
                  },
                }
          }
          onChange={handleTableChange}
          dataSource={(dataSource??(store()?.[dataState || 'itemList']))?.map((item: any, index: number) => {
            return { ...item, index: index + 1 + ((page??1) - 1) * (limit??0) };
          })}
          columns={columns}
          scroll={scroll}
          footer={footer}
          rowKey={rowKey}
          summary={summary}
          rowSelection={rowSelection}
          expandable={expandable ?? undefined}
          rowClassName={rowClassName}
          size={size || 'small'}
          locale={locale}
        />
      </div>
      {/* </TableWrapper> */}
      {Form && (
        <>
          {formType === 'Drawer' ? (
            <Drawer
              title={titleForm}
              width={widthDrawer}
              onClose={() => {
                setRecord({})
                if (setVisibleState) {
                  store()?.[setVisibleState](false);
                } else {
                  setVisibleForm(false);
                  setEdit(false)
                  setView(false)
                  setIsCreate(false)
                  setCondition({})
                }
                onCloseForm && onCloseForm();
              }}
              destroyOnClose
              footer={drawerFooter}
              styles={{ body: { padding: 0 } }}
              open={visibleState ? store()?.[visibleState] : visibleForm}
              extra={drawerExtra}
              {...propsDrawer}
            >
              <Form />
            </Drawer>
          ) : (
            <Modal
              onCancel={() => {
                if (setVisibleState) {
                  store()?.[setVisibleState](false);
                } else {
                  setVisibleForm(false);
                }
                onCloseForm && onCloseForm();
              }}
              width={widthDrawer}
              destroyOnClose
              footer={false}
              styles={{ body: { padding: 0 } }}
              open={visibleState ? store()?.[visibleState] : visibleForm}
            >
              <Form />
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default TableBase;
