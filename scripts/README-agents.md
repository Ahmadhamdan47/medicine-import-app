# Agent Import Scripts - Quick Start

This directory contains scripts to import pharmaceutical agents from CSV and create test accounts.

## 🚀 Quick Start

```bash
# 1. Import agents and create accounts
npm run create-agents

# 2. Validate the import
npm run validate-agents
```

## 📋 What Gets Created

- **Agent Records**: Company information in `agent` table
- **User Accounts**: Login credentials for each agent
- **Default Password**: `agent123` for all accounts
- **Email Format**: `{name}.{index}@agent-test.com`
- **Username Format**: `{name}_{index}`

## 📊 Sample Output

```
✅ Successfully created: 115
🔑 Default password: agent123
📧 Sample email: droguerie.columbus.001@agent-test.com
👤 Sample username: droguerie_columbus_001
```

## ⚠️ Security Notes

- **Testing Only**: These accounts are for development/testing
- **Change Passwords**: Update before production
- **Test Email Domain**: Uses `@agent-test.com`

## 📖 Full Documentation

See [docs/agent-import-script.md](../docs/agent-import-script.md) for complete documentation.

## 🔧 Files

- `create-agents-from-csv.js` - Main import script
- `validate-agent-import.js` - Validation and testing
- `../src/data/agent.csv` - Source data file
- `../docs/agent-import-script.md` - Full documentation

---

*For questions or issues, check the error logs or full documentation.*
