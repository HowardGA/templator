import {Layout, Button, Spin, Card, Descriptions, Typography, Space} from "antd"; 
import { useState } from "react";
import { useSyncData, useGetUserInfo, useGetSalesforceContactStatus } from "../../Template-Creator/hooks/saleforceHooks";
import SaleForceModal from "./SaleForceModal";
import { FaSync, FaEnvelope, FaUserCircle, FaExclamationCircle, FaCheckCircle, FaKey } from "react-icons/fa";
import { useGetOdooToken } from "../hooks/userHooks";
import OdooTokenModal from "./OdooTokenModal";
const { Title, Text } = Typography;

const UserProfile = ({userId}) => {
    const {data: userData, isLoading} = useGetUserInfo(userId);
    const {
        data: salesforceContactStatus,
        isLoading: isLoadingSfStatus,
        isError: isSfStatusError, 
        error: sfStatusError
    } = useGetSalesforceContactStatus();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {mutate: syncData, isPending} = useSyncData();
    const {data: odooToken, isLoading: isLoadingOdooToken} = useGetOdooToken();
    const [isTokenVisible, setIsTokenVisible] = useState(false);

    const handleModalSubmit = (saleForceData) => {
        syncData(saleForceData);
        setIsModalOpen(false);
    }

    const showOdooToken = () => {
        setIsTokenVisible(true);
    }

    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
    }

    const handleSyncBtn = () => {
        toggleModal();
    }

    if (isLoading || isLoadingSfStatus){
        return (
            <Layout style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" tip="Loading User Profile..." />
            </Layout>
        );
    }

    if (!userData) {
        return (
            <Layout style={{ padding: '24px', textAlign: 'center' }}>
                <Text type="danger">User data not found.</Text>
            </Layout>
        );
    }
    const salesforceContactData = salesforceContactStatus?.data.contactData;
    const initialFormContactData = {
        firstName: userData.data.firstName || '',
        lastName: userData.data.lastName || '',
        email: userData.data.email || '',
        jobTitle: salesforceContactData?.Title || '',
        phoneNumber: salesforceContactData?.Phone || '',
        specificInterests: salesforceContactData?.Top_3_topics__c
            ? salesforceContactData.Top_3_topics__c.split(';')
            : [], 
        isCompany: !!salesforceContactData?.AccountId && salesforceContactData.AccountId !== import.meta.env.VITE_GENERIC_ACCOUNT_ID_FRONTEND, 
        companyName: salesforceContactData?.Account?.Name || '',
        industry: salesforceContactData?.Account?.Industry || '',
    };

    const isContactRegistered = salesforceContactStatus?.data.isContactRegistered;
    const buttonText = isContactRegistered ? 'Update Salesforce Profile' : 'Sync to Salesforce';
    const statusIcon = isContactRegistered ? <FaCheckCircle style={{ color: 'green' }} /> : <FaExclamationCircle style={{ color: 'orange' }} />;
    const statusMessage = isContactRegistered ? 'Profile already synced with Salesforce.' : 'Profile not yet synced with Salesforce.';
    if(!isLoadingSfStatus){
        console.log(salesforceContactStatus)
    }
    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Text>
                    {statusIcon} {statusMessage}
                    {isSfStatusError && (
                        <Text type="danger" style={{ marginLeft: '8px' }}>
                            (Error checking status: {sfStatusError.message || 'Unknown error'})
                        </Text>
                    )}
                </Text>
                <Button
                    onClick={handleSyncBtn}
                    icon={<FaSync />}
                    loading={isPending} 
                    type="primary"
                >
                    {buttonText}
                </Button>
                <Button
                    onClick={showOdooToken}
                    icon={<FaKey />}
                    loading={isLoadingOdooToken} 
                    type="primary"
                >
                    Get Odoo Token
                </Button>
            </div>
             <Card title={<Title level={4}>User Profile</Title>} style={{ marginBottom: '24px' }}>
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label={<Space><FaUserCircle /> Name</Space>}>
                        {userData.data.firstName} {userData.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><FaEnvelope /> Email</Space>}>
                        {userData.data.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role">
                        {userData.data.role}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Created">
                        {new Date(userData.data.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Updated">
                        {new Date(userData.data.updatedAt).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <SaleForceModal
                isModalOpen={isModalOpen}
                onCancel={toggleModal}
                onSubmit={handleModalSubmit}
                initialFormData={initialFormContactData}
            />
            {isTokenVisible && (
                <OdooTokenModal
                    isModalOpen={isTokenVisible}
                    odooToken={odooToken?.data || ''}
                    onCancel={() => setIsTokenVisible(false)}
                />
            )}
        </Layout>
    );
};

export default UserProfile;