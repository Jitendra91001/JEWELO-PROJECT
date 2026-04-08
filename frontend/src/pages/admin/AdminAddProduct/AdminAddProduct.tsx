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
import {
  getProductById,
  postProduct,
  updateProduct,
} from "@/store/admin/adminThunk";
import type { UploadFile } from "antd/es/upload/interface";
import UploadInputField from "@/components/ui/upload";

const { Option } = Select;
const { TextArea } = Input;

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

  const [allCategory, setCategory] = useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await dispatch(fetchCategory()).unwrap();
        if (res?.success) setCategory(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategoryData();
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        category: editData.category?.id,
        description: editData.description,
        price: editData.price,
        cost: editData.cost,
        sku: editData.sku,
        quantity: editData.quantity,
        material: editData.material,
        weight: editData.weight,
        isFeatured: editData.isFeatured,
      });

      if (editData.thumbnail) {
        setFileList([
          {
            uid: "-1",
            name: "thumbnail.png",
            status: "done",
            url: editData.thumbnail.startsWith("http")
              ? editData.thumbnail
              : `http://localhost:5000${editData.thumbnail}`,
          },
        ]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [editData, form]);

  const fetchData = async () => {
    const name = editData?.id;
    const response = await dispatch(getProductById(name)).unwrap();
    console.log(response, "data");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values: any) => {
    const slugname = values.name.toLowerCase().replace(/\s+/g, "-");

    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("slug", slugname);
    formData.append("description", values.description || "");
    formData.append("price", values.price);
    formData.append("cost", values.cost || 0);
    formData.append("categoryId", values.category);
    formData.append("sku", values.sku || "");
    formData.append("quantity", values.quantity || 0);
    formData.append("material", values.material || "");
    formData.append("weight", values.weight || 0);
    formData.append("isFeatured", values.isFeatured ? "true" : "false");
    formData.append("isActive", "true");

    try {
      if (editData?.id) {
        if (fileList[0]?.originFileObj) {
          formData.append("thumbnail", fileList[0].originFileObj);
        }

        await dispatch(
          updateProduct({
            id: editData.id,
            data: formData,
          }),
        ).unwrap();
        toast.success("Product updated successfully");
      } else {
        if (fileList[0]?.originFileObj) {
          formData.append("thumbnail", fileList[0].originFileObj);
        }

        await dispatch(postProduct(formData)).unwrap();
        toast.success("Product added successfully");
      }

      form.resetFields();
      setFileList([]);
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1000}
      title={editData?.id ? "Edit Product" : "Add Product"}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Diamond Earrings" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select category">
              {allCategory.map((cat: any) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item label="Description" name="description">
          <TextArea rows={3} value={editData?.description} />
        </Form.Item>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="Material" name="material">
            <Input />
          </Form.Item>

          <Form.Item
            label="Price (₹)"
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Cost (₹)" name="cost">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>

          <Form.Item label="Quantity" name="quantity">
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="Weight (grams)" name="weight">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </div>

        {/* Featured */}
        <Form.Item name="isFeatured" valuePropName="checked">
          <Checkbox>Featured Product</Checkbox>
        </Form.Item>

        {/* Thumbnail */}
        <Form.Item
          label="Thumbnail"
          name="thumbnail"
          rules={[{ required: !editData }]}
        >
          <UploadInputField fileList={fileList} setFileList={setFileList} />
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button type="primary" htmlType="submit" loading={loading}>
            {editData?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdminAddProduct;
