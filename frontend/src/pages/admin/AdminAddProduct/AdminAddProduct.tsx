import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Checkbox,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory, type Product } from "@/store/productSlice";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store";
import { postProduct } from "@/store/admin/adminThunk";
import type { UploadFile } from "antd/es/upload/interface";
import UploadInputField from "@/components/ui/upload";
const { Option } = Select;
interface AdminAddProductProps {
  isOpen: boolean;
  editData?: Product | null;
  setOpen: (value: boolean) => void;
}

const AdminAddProduct: React.FC<AdminAddProductProps> = ({
  isOpen,
  editData,
  setOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const { loading } = useSelector((state: RootState) => state.products);
  const [allCategory, setCategory] = React.useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchCategoryData = async () => {
    try {
      const response = await dispatch(fetchCategory()).unwrap();
      if (response?.success) {
        setCategory(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        category: editData.category?.id,
        price: editData.price,
        material: editData.material,
        stock: editData.stock,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async (values: any) => {
    const slugname = values?.name.toLowerCase().replace(/\s+/g, "_");
    const formData = new FormData();

    formData.append("name", values.name.trim());
    formData.append("slug", slugname);
    formData.append("categoryId", values.category);
    formData.append("price", values.price);
    formData.append("material", values.material || "");
    formData.append("stock", values.stock || 0);
    // formData.append("isFeatured", true);
    if (fileList.length > 0) {
      if (fileList[0].originFileObj) {
        formData.append("thumbnail", fileList[0].originFileObj);
      }
    }
    try {
      if (editData?.id) {
        // await dispatch(updateProduct({ id: editData.id, data: formData })).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(postProduct(formData)).unwrap();
        toast.success("Product added successfully");
      }
      setOpen(false);
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      toast.error(error || "Something went wrong");
    }
  };
  return (
    <Modal
      open={isOpen}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
      height={600}
      title={editData?.id ? "Edit Product" : "Add New Product"}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Field is required!" }]}
        >
          <Input placeholder="Enter product name" maxLength={100} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Field is required!" }]}
          >
            <Select placeholder="Select category">
              {allCategory?.map((cat: any) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Material"
            name="material"
            rules={[{ required: true, message: "Field is required!" }]}
          >
            <Input placeholder="18K Gold, Platinum..." />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Price (₹)"
            name="price"
            rules={[{ required: true, message: "Field is required!" }]}
          >
            <InputNumber className="w-full" min={0} placeholder="Enter price" />
          </Form.Item>

          <Form.Item label="Stock" name="stock">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true, message: "Field is required!" }]}
          >
            <UploadInputField
              fileList={fileList}
              setFileList={(files: UploadFile[]) => {
                setFileList(files);
                form.setFieldsValue({ thumbnail: files[0] });
              }}
            />
          </Form.Item>
          {/* <Form.Item label="Active" name="is_active" rules={[{required:true , message:'Field is required!'}]}>
            <Checkbox />
          </Form.Item> */}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            type="primary"
            htmlType="submit"
            className="gold-gradient text-primary-foreground px-4 py-2 rounded-md font-semibold text-sm inline-flex items-center gap-2 shimmer hover:opacity-90 transition-opacity"
            loading={loading}
          >
            {editData?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdminAddProduct;
