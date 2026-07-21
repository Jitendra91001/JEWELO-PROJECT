import { SearchOutlined } from "@ant-design/icons";
import React, {  useCallback, useEffect, useState } from "react";
import NormalInputField from "../InputField/NormalInput";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash/debounce";
import "./searchOptions2.css";
import { useTheme } from "../../../contexts/Theme/Theme.context";


const CustomSpinner = () => {
  return (
    <svg
      aria-hidden="true"
      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-[--primary]"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
};

interface SearchTypes {
  options: any[];
  isLoading: boolean;
  totalItems: number;
  updateParams: any;
  className?: string,
  size?: string,
  handleItemsSelect: (item: any) => void;
  selectedItems: any;
  handleSearch: (e: any) => void;
  noDataStyle?: React.CSSProperties;
  placeholder?: string;
  closeDropdownOptions: boolean;
  setCloseDropdownOptions: any;
  moduleName?:string;
}

const SearchOptionInfiniteScroll = ({
  options,
  isLoading,
  totalItems,
  updateParams,
  handleItemsSelect,
  moduleName ,
  selectedItems,
  handleSearch,
  className,
  size,
  noDataStyle,
  placeholder,
  closeDropdownOptions,
  setCloseDropdownOptions
}: SearchTypes) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [listOptions, setListOptions] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const { Color } = useTheme()
  const { t } = useTranslation();

  useEffect(() => {
    if(options.length === 0){
      setListOptions([])
    }
    else if(listOptions?.length < totalItems) {
      if(moduleName === "doctorSearch"){
        setListOptions(options);
      }
      else{
        setListOptions((prev: any) => [...prev, ...options]);
      }
    }
  }, [options , moduleName]);

  const handleSearching = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListOptions([]);
    handleSearch(e)
  };

  const fetchMoreData = () => {
    if (totalItems > listOptions.length) {
      updateParams((prev: any) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearching, 500), []);

  const handleInput = (e: any) => {
    setSearchInput(e.target.value);
    debouncedHandleSearch(e);
  };
  const focusOut = () => {
    setShowOptions(false)
  }

  useEffect(() => {
    if (closeDropdownOptions === false) {
      setShowOptions(false)
    } else if (closeDropdownOptions === true) {
      setShowOptions(true)
    }
  }, [closeDropdownOptions])

  return (
    <div>
      <div className='relative'>
        <NormalInputField
          type="text"
          value={searchInput}
          size={size ? size : "middle"}
          prefix={
            <SearchOutlined
              width={88}





            />
          }
          placeholder={placeholder ?? "Search items.."}

          name="department"
          onChange={handleInput}
          onFocus={() => {
            setShowOptions(true);
            setCloseDropdownOptions(true);
          }}
          onBlur={focusOut}

        />
        {showOptions && (
          <>
            <div
              id="scrollableDiv"
              style={noDataStyle}
              className={`absolute rounded-md top-[104%] left-0 z-10 ${(listOptions?.length === 0 || listOptions?.length < 8) ? "" : "shadow-md"}`}
            >
              
              <InfiniteScroll
                dataLength={listOptions.length}
                next={fetchMoreData}
                inverse={false} //
                hasMore={totalItems > listOptions.length}
                loader={
                  <div className="text-center py-2 ">
                    <CustomSpinner />
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {listOptions?.length !== 0 ? (
                  listOptions?.map((item, index) => {
                    return (
                      <h4
                        key={index}
                        className={`bg-${selectedItems?.id === item?.id
                          ? "[--primary]"
                          : "[--whiteBlack]"
                          } w-full border-b-2 border-x-0 border-t-0 border-gray-100 border-solid hover:bg-${selectedItems?.id === item?.id
                            ? "[--primary]"
                            : "[--secondary]"
                          }  cursor-pointer px-8 text-${selectedItems?.id === item?.id
                            ? "[#fff]"
                            : "[--lightText]"
                          } py-2`}
                        onClick={() => {
                          setSearchInput(item?.title);
                          handleItemsSelect(item);
                          setShowOptions(false);
                          setCloseDropdownOptions(false);
                        }}
                      >
                        {item.title}
                      </h4>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex justify-center items-center" >
                    {" "}
                    <h4 className="text-[--lightText]" >
                      {t("No data Found !")}
                    </h4>
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchOptionInfiniteScroll;
