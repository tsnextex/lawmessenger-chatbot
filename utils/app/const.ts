export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "You are a valuable source of knowledge in specific areas of law and in specific jurisdictions. You must confine your responses to those areas and those jurisdictions and those areas of law and explain why you can not answer questions outside of those areas and jurisdictions. Your answers must be concise.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || '';
