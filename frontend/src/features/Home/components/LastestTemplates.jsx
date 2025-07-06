import { useLatestTemplates } from "../hooks/mainPageHooks";
import TemplateCard from "./TemplateCard";
import { Row, Col, Pagination, Spin } from "antd";
import { useState } from "react";

const LastestTemplates = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const { data, isLoading, isError } = useLatestTemplates({
        page: currentPage,
        limit: pageSize,
    });

    if (isLoading)
        return (
            <Spin
                size="large"
                style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
            />
        );
    if (isError) {
        return (
            <Alert
                message="Error loading templates"
                description={data.message}
                type="error"
                showIcon
            />
        );
    }
    console.log(data);
    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
                {data.data.templates.map((template) => (
                    <Col key={template.id} xs={24} sm={12} md={8} lg={6}>
                        <TemplateCard template={template} />
                    </Col>
                ))}
            </Row>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={data.pagination?.total || 0}
                    onChange={(newPage, newPageSize) => {
                        setCurrentPage(newPage);
                        setPageSize(newPageSize);
                    }}
                    showSizeChanger
                    pageSizeOptions={["8", "12", "16", "24"]}
                />
            </div>
        </div>
    );
};

export default LastestTemplates;
