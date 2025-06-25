import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { TemplateProvider, useTemplateContext } from '../../context/TemplateProvider';
import { TemplateForm } from '../../components/TemplateForm';
import { Toaster } from 'react-hot-toast';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Example: check for user session (replace with your auth logic)
  const user = null; // TODO: get user from session/cookie
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const TemplateTable = () => {
  const { data, isLoading, error, remove } = useTemplateContext();
  const [editTemplate, setEditTemplate] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button className="btn btn-primary" onClick={() => { setEditTemplate(null); setShowModal(true); }}>
          New Template
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Rate</th>
              <th className="px-4 py-2 text-left">Hours</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="text-center text-red-500">{error}</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8">No templates found.</td></tr>
            ) : (
              data.map((tpl: any) => (
                <tr key={tpl.id} className="border-t">
                  <td className="px-4 py-2">{tpl.name}</td>
                  <td className="px-4 py-2">{tpl.rate}</td>
                  <td className="px-4 py-2">{tpl.hours}</td>
                  <td className="px-4 py-2">{tpl.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => { setEditTemplate(tpl); setShowModal(true); }}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => remove(tpl.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg">
            <TemplateForm initialValues={editTemplate} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const TemplatesPage = () => (
  <TemplateProvider>
    <Toaster />
    <TemplateTable />
  </TemplateProvider>
);

export default TemplatesPage; 