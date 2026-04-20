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

interface Category {
  id: string;
  name: string;
}

interface ProductFormValues {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  category: string;
  sku?: string;
  quantity?: number;
  material?: string;
  weight?: number;
  isFeatured?: boolean;
}
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store";
import {
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
  setEditData?: (value: Product | null | undefined) => void;
  onSave?: (product: Product, isEdit: boolean) => void;
}

const AdminAddProduct: React.FC<AdminAddProductProps> = ({
  isOpen,
  editData,
  setOpen,
  setEditData,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const { loading } = useSelector((state: RootState) => state.products);

  const [allCategory, setCategory] = useState<Category[]>([]);
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
        category: typeof editData.category === "string" ? editData.category : editData.category?.id,
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

  const handleSubmit = async (values: ProductFormValues) => {
    // Validate thumbnail for new products
    if (!editData?.id && fileList.length === 0) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    const slugname = values.name.toLowerCase().replace(/\s+/g, "-");
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("slug", slugname);
    formData.append("description", values.description?.toString() || "");
    formData.append("price", values.price.toString());
    formData.append("cost", (values.cost ?? 0).toString());
    formData.append("categoryId", values.category);
    formData.append("sku", values.sku?.toString() || "");
    formData.append("quantity", (values.quantity ?? 0).toString());
    formData.append("material", values.material?.toString() || "");
    formData.append("weight", (values.weight ?? 0).toString());
    formData.append("isFeatured", values.isFeatured ? "true" : "false");
    formData.append("isActive", "true");

    if (fileList[0]?.originFileObj) {
      formData.append("thumbnail", fileList[0].originFileObj);
    }

    try {
      const response = editData?.id
        ? await dispatch(
            updateProduct({
              id: editData.id,
              data: formData,
            }),
          ).unwrap()
        : await dispatch(postProduct(formData)).unwrap();

      toast.success(editData?.id ? "Product updated successfully" : "Product added successfully");
      if (onSave) onSave(response, Boolean(editData?.id));

      form.resetFields();
      setFileList([]);
      setOpen(false);
      setEditData?.(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setOpen(false);
        setEditData?.(null);
      }}
      footer={null}
      width={1000}
      title={editData?.id ? "Edit Product" : "Add Product"}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-[12px] py-[10px]">
        <div className="space-y-[5px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[5px]">
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true }]}
              className="px-[5px] py-[2px]"
            >
              <Input placeholder="Diamond Earrings" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true }]}
              className="px-[5px] py-[2px]"
            >
              <Select placeholder="Select category">
                {allCategory.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description" className="px-[5px] py-[2px]">
            <TextArea rows={4} className="w-full" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px]">
            <Form.Item label="Material" name="material" className="px-[5px] py-[2px]">
              <Input />
            </Form.Item>

            <Form.Item
              label="Price (₹)"
              name="price"
              rules={[{ required: true }]}
              className="px-[5px] py-[2px]"
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item label="Cost (₹)" name="cost" className="px-[5px] py-[2px]">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[5px]">
            <Form.Item label="SKU" name="sku" className="px-[5px] py-[2px]">
              <Input />
            </Form.Item>

            <Form.Item label="Quantity" name="quantity" className="px-[5px] py-[2px]">
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item label="Weight (grams)" name="weight" className="px-[5px] py-[2px]">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="isFeatured" valuePropName="checked" className="px-[5px] py-[2px]">
            <Checkbox>Featured Product</Checkbox>
          </Form.Item>

          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            className="px-[5px] py-[2px]"
          >
            <UploadInputField fileList={fileList} setFileList={setFileList} />
          </Form.Item>

          <div className="flex flex-wrap justify-end gap-[5px] pt-[5px] pb-[5px]">
            <Button onClick={() => setOpen(false)}>Cancel</Button>

            <Button type="primary" htmlType="submit" loading={loading}>
              {editData?.id ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AdminAddProduct;
