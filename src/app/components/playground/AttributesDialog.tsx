import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'sonner';
import {
  useAddAttributes,
  useDeleteAttribute,
  useUpdateAttributes,
} from '@/utils/attributes-api';
import { axiosError } from '@/types/axiosTypes';
import { ToSnakeCase } from '@/utils/text-conveter';
import { isValidUrl } from '@/utils/validator';
import { usePlayground } from './playgroundArea/PlaygroundContext';

export interface Attribute {
  _id: string;
  chatbotId: string;
  name: string;
  alias: string;
  value: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const AttributesDialog = ({
  attributesHandler,
  chatbotId,
}: {
  attributesHandler: () => void;
  chatbotId: string;
}) => {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [originalName, setOriginalName] = useState<string>('');
  const [originalValue, setOriginalValue] = useState<string>('');
  const [editId, setEditId] = useState<string>('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { refetchAttributesHandler, attributeState } = usePlayground();
  const [attributeList, setAttributeList] = useState<Attribute[]>(
    attributeState?.attributesData || []
  );
  useEffect(() => {
    if (tab === 0) {
      setName('');
      setValue('');
      setEditId('');
      setOriginalName('');
      setOriginalValue('');
    }
  }, [tab]);
  const { mutate: onAddAttributes, isPending: isAddPending } = useAddAttributes(
    {
      onSuccess(data) {
        setAttributeList(data?.data);
        refetchAttributesHandler();
        setName('');
        setValue('');
        setEditId('');
        setOriginalName('');
        setOriginalValue('');
        toast.success(data?.message);
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'add attributes failed';
        toast.error(errorMessage);
      },
    }
  );
  const { mutate: onUpdateAttributes, isPending: isUpdatePending } =
    useUpdateAttributes({
      onSuccess(data) {
        refetchAttributesHandler();
        setAttributeList(data?.data);
        setOriginalName(name);
        setOriginalValue(value);
        toast.success(data?.message);
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'update attributes failed';
        toast.error(errorMessage);
      },
    });
  const handleSave = async () => {
    if (!name) {
      toast.warning('Please enter name');
      return;
    }

    if (!value) {
      toast.warning('Please enter value');
      return;
    }

    // Special validation for Website URL
    if (name === 'Website URL') {
      const isValidUrlData = await isValidUrl(value);
      if (!isValidUrlData) {
        toast.warning('Please enter a valid website url');
        return;
      }
    }

    // If all validations pass, add the attributes
    onAddAttributes({
      chatbotId: chatbotId,
      details: {
        attributes: [
          {
            name: name,
            alias: ToSnakeCase(name),
            value: value,
          },
        ],
      },
    });
  };
  const handleEditClick = () => {
    nameInputRef.current?.focus();
  };
  const handleUpdate = async (attributeId: string) => {
    if (!name) {
      toast.warning('Please enter name');
      return;
    }

    if (!value) {
      toast.warning('Please enter value');
      return;
    }

    // Special validation for Website URL
    if (name === 'Website URL') {
      const isValidUrlData = await isValidUrl(value);
      if (!isValidUrlData) {
        toast.warning('Please enter a valid website url');
        return;
      }
    }

    // Only update if something has changed
    if (originalName === name && originalValue === value) {
      return; // No changes, no need to update
    }

    // If all validations pass and there are changes, update the attributes
    onUpdateAttributes({
      chatbotId: chatbotId,
      attributeId: attributeId,
      details: {
        name: name,
        alias: ToSnakeCase(name),
        value: value,
      },
    });
  };
  const { mutate: onDeleteAttribute, isPending: isPendingDelete } =
    useDeleteAttribute({
      onSuccess(data) {
        setTab(0);
        refetchAttributesHandler();
        setAttributeList(data?.data);
        toast.success(data?.message);
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'delete attributes failed';
        toast.error(errorMessage);
      },
    });
  const handleDelete = (attributeId: string) => {
    onDeleteAttribute({
      chatbotId: chatbotId,
      attributeId: attributeId,
    });
  };
  const disabledAttributes = [
    'ChatAgent Name',
    'Company Name',
    'Company Address',
    'About Us',
    'Website URL',
  ];
  return (
    <div
      className='absolute md:right-6 top-32 min-[699px]:top-20 px-4 pb-4 sm:px-6 sm:pb-4 pt-2 sm:pt-3 w-[-webkit-fill-available] bg-[#F8F8F8] md:w-[600px] min-[870px]:w-[700px] h-auto md:h-[70vh] mx-6 md:mx-0 rounded-lg overflow-hidden'
      style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
    >
      {(isAddPending || isUpdatePending || isPendingDelete) && (
        <div className='absolute inset-0 bg-[#a6dae41a] z-50 flex items-center justify-center backdrop-blur-[3px]'>
          <div role='status'>
            <div className='w-10 h-10 border-4 border-gray-200 border-t-[#3bc5dd] rounded-full animate-spin'></div>
          </div>
        </div>
      )}
      <div className='flex items-center justify-between mb-1 md:mb-3 '>
        <div></div>
        <div className='text-primary font-medium text-lg'>Attributes</div>
        <IoCloseOutline
          className='text-2xl cursor-pointer'
          onClick={() => attributesHandler()}
          aria-label='Close dialog'
        />
      </div>

      <div className='flex md:flex-row flex-col gap-4 md:gap-3 mt-0 md:mt-4 '>
        <div className='w-full md:w-4/6 '>
          {tab === 0 ? (
            <div className='flex flex-col gap-3 md:gap-4'>
              <div className='w-full'>
                <label
                  htmlFor='title'
                  className='text-black font-normal text-lg'
                >
                  Title
                </label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Add title'
                  className='mt-2 p-5 text-[#1E255EB2] bg-white flex-1 border-[#EFEFEF] rounded focus-visible:ring-0 placeholder:text-sm w-full'
                />
              </div>
              <div className='w-full'>
                <label
                  htmlFor='value'
                  className='text-black font-normal text-lg'
                >
                  Value
                </label>
                <Input
                  id='value'
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='Add value'
                  className='mt-2 p-5 text-[#1E255EB2] bg-white flex-1 border-[#EFEFEF] rounded focus-visible:ring-0 placeholder:text-sm w-full'
                />
              </div>
              <Button
                className='w-fit text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] py-3 rounded hover:from-[#53A7DD] hover:to-[#58C8DD]'
                onClick={handleSave}
              >
                Save value
              </Button>
            </div>
          ) : (
            <div>
              <div className='flex items-center justify-between'>
                <Input
                  id='name'
                  value={name}
                  ref={nameInputRef}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleUpdate(editId)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(editId)}
                  placeholder='Add title'
                  disabled={disabledAttributes.includes(name)}
                  className='p-0 max-w-[200px] !shadow-none text-primary font-medium text-lg bg-transparent !w-fit border-none rounded focus-visible:px-2 placeholder:text-sm disabled:opacity-100 disabled:text-primary disabled:bg-transparent'
                />
                <div
                  className={`flex gap-2 items-center ${
                    disabledAttributes.includes(name) ? 'hidden' : ''
                  }`}
                >
                  <div
                    className='bg-white p-2 rounded cursor-pointer flex items-center gap-1'
                    onClick={handleEditClick}
                  >
                    <BiEditAlt />
                    <span className='text-sm hidden md:block font-normal text-primary'>
                      Rename
                    </span>
                  </div>
                  <div
                    className='bg-white p-2 rounded cursor-pointer flex items-center gap-1'
                    onClick={() => handleDelete(editId)}
                  >
                    <RiDeleteBinLine className='text-[#FF0000]' />
                    <span className='text-sm hidden md:block font-normal text-[#FF0000]'>
                      Delete
                    </span>
                  </div>
                </div>
              </div>
              <div className='w-full mt-4'>
                <label
                  htmlFor='value'
                  className='text-black font-normal text-lg'
                >
                  Value
                </label>
                <Input
                  id='value'
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='Add value'
                  onBlur={() => handleUpdate(editId)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(editId)}
                  onClick={(e) => e.stopPropagation()}
                  className='mt-2 p-5 text-[#1E255EB2] bg-white flex-1 border-[#EFEFEF] rounded focus-visible:ring-0 placeholder:text-sm w-full'
                />
              </div>
            </div>
          )}
        </div>

        <div
          className='w-full md:w-2/6 h-auto max-[768px]:max-h-[30vh]  md:h-[55vh] p-5 bg-white rounded-xl flex flex-col gap-3'
          style={{ boxShadow: '1px 0px 8px 2px #00000014' }}
        >
          <div className='flex flex-col  overflow-auto gap-3'>
            {attributeList &&
              attributeList.map((item, index) => (
                <span
                  key={index}
                  onClick={() => {
                    setTab(1);
                    setName(item.name);
                    setOriginalName(item.name);
                    setOriginalValue(item.value);
                    setValue(item.value);
                    setEditId(item._id);
                  }}
                  className='text-primary cursor-pointer font-normal text-sm opacity-80 hover:opacity-100'
                >
                  {item.name}
                </span>
              ))}
          </div>
          <div
            className='flex items-center cursor-pointer gap-2 '
            onClick={() => setTab(0)}
          >
            <FaPlus className='text-[#7A7A7A]' />
            <span className='text-[#7A7A7A] font-normal text-sm'>Add new</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributesDialog;
