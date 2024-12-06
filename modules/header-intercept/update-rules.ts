import { DeclarativeNetRequest } from 'wxt/browser';
import { STATUS_GLOBAL_ENUM } from '@/types';
import { HeaderInterceptConfig, HeaderRuleItem, MATCH_TYPE_ENUM, RULE_TYPE_ENUM } from './types';
import { STORAGE_KEY_HEADER_INTERCEPT } from './const';
import { headerInterceptConfig } from './data';

// 用于跟踪下一个可用的唯一 ID
let nextRuleId = 1;

/**
 * 更新网络请求的动态规则
 *
 */
export const updateDynamicRules = async () => {
  // 1. 获取当前的动态规则
  const existingRules = await browser.declarativeNetRequest.getDynamicRules();

  // 2. 提取现有规则的 ruleId
  const oldRuleIds = existingRules.map((rule) => rule.id);

  // 3. 删除旧规则 & 添加新规则
  const newRules = headerInterceptConfig.value.toggle ? await getNewRules() : [];

  browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [...oldRuleIds],
    addRules: [...newRules]
  });
};

const getNewRules = async (): Promise<DeclarativeNetRequest.Rule[]> => {
  const res = await storage.getItem<string>(STORAGE_KEY_HEADER_INTERCEPT);
  if (!res) {
    return [];
  }

  // 循环解析 HeaderInterceptConfig 中的规则配置
  const curHeaderInterceptConfig = JSON.parse(res) as HeaderInterceptConfig;
  const rules: DeclarativeNetRequest.Rule[] = [];

  (curHeaderInterceptConfig.data ?? []).map((groupItem) => {
    groupItem.rules.map((ruleItem) => {
      if (ruleItem.state === STATUS_GLOBAL_ENUM.停用) {
        return;
      }

      const ruleFuncMap: Record<RULE_TYPE_ENUM, () => void> = {
        [RULE_TYPE_ENUM['阻止请求']]: () => {
          const blockConfig: DeclarativeNetRequest.Rule = {
            id: nextRuleId++,
            priority: 1,
            action: {
              type: 'block'
            },
            condition: {
              isUrlFilterCaseSensitive: true,
              resourceTypes: allResourceTypes,
              requestMethods: ruleItem.requestMethods ?? []
            }
          };
          setRuleCondition(blockConfig, ruleItem);

          rules.push(blockConfig);
        },
        [RULE_TYPE_ENUM['重定向请求']]: () => {
          const redirectConfig: DeclarativeNetRequest.Rule = {
            id: nextRuleId++,
            priority: 1,
            action: {
              type: 'redirect',
              redirect: {
                url: ruleItem.redirectUrl ?? ''
              }
            },
            condition: {
              isUrlFilterCaseSensitive: true,
              resourceTypes: allResourceTypes,
              requestMethods: ruleItem.requestMethods ?? []
            }
          };
          setRuleCondition(redirectConfig, ruleItem);

          rules.push(redirectConfig);
        },
        [RULE_TYPE_ENUM['修改请求头']]: () => {
          const curheadersConfig = ruleItem.headersConfig?.filter(
            (header) => header.status !== STATUS_GLOBAL_ENUM.停用
          );

          const modifyHeadersConfig: DeclarativeNetRequest.Rule = {
            id: nextRuleId++,
            priority: 1,
            action: {
              type: 'modifyHeaders',
              requestHeaders:
                curheadersConfig?.map((header) => ({
                  operation: 'set',
                  header: header.key ?? '',
                  value: header.value ?? ''
                })) ?? []
            },
            condition: {
              isUrlFilterCaseSensitive: true,
              resourceTypes: allResourceTypes,
              requestMethods: ruleItem.requestMethods ?? []
            }
          };
          setRuleCondition(modifyHeadersConfig, ruleItem);

          rules.push(modifyHeadersConfig);
        },
        [RULE_TYPE_ENUM['修改响应头']]: () => {
          const modifyHeadersConfig: DeclarativeNetRequest.Rule = {
            id: nextRuleId++,
            priority: 1,
            action: {
              type: 'modifyHeaders',
              responseHeaders:
                ruleItem.headersConfig?.map((header) => ({
                  operation: 'set',
                  header: header.key ?? '',
                  value: header.value ?? ''
                })) ?? []
            },
            condition: {
              isUrlFilterCaseSensitive: true,
              resourceTypes: allResourceTypes,
              requestMethods: ruleItem.requestMethods ?? []
            }
          };
          setRuleCondition(modifyHeadersConfig, ruleItem);

          rules.push(modifyHeadersConfig);
        }
      };

      ruleFuncMap[ruleItem.ruleType]?.();
    });
  });

  return rules;
};

/**
 * 设置规则的条件
 *
 * @param {DeclarativeNetRequest.Rule} ruleConfig 当前规则
 * @param {HeaderRuleItem} ruleItem 缓存规则项
 */
const setRuleCondition = (ruleConfig: DeclarativeNetRequest.Rule, ruleItem: HeaderRuleItem) => {
  const { includeConfig } = ruleItem;

  switch (ruleItem.matchType) {
    case MATCH_TYPE_ENUM.全部:
      ruleConfig.condition.urlFilter = '*';
      break;
    case MATCH_TYPE_ENUM.正则表达式:
      ruleConfig.condition.regexFilter = `${includeConfig}`;
      break;
    case MATCH_TYPE_ENUM.网址前缀:
      ruleConfig.condition.urlFilter = `${includeConfig}/*`;
      break;
    case MATCH_TYPE_ENUM.域名:
      ruleConfig.condition.requestDomains =
        includeConfig && includeConfig.trim() !== '' ? includeConfig.split(',') : [];
      break;
    case MATCH_TYPE_ENUM.网址:
      ruleConfig.condition.urlFilter = `${includeConfig}`;
      break;
    default:
      break;
  }
};

const allResourceTypes: DeclarativeNetRequest.ResourceType[] = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'font',
  'object',
  'xmlhttprequest',
  'ping',
  'media',
  'websocket',
  'csp_report',
  'other'
];
