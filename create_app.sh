# ----------------------------------------------------
# 0. 변수 설정
# ----------------------------------------------------
RESOURCE_GROUP="rg-linkcare-app"
LOCATION="koreacentral"                   # 서울 리전
ACR_NAME="crlinkcareapp"                 # 중복 없는 소문자+숫자 조합 필수
CONTAINERAPPS_ENV="cae-linkcare-app"
API_APP_NAME="app-api"
WEB_APP_NAME="app-web"

# ----------------------------------------------------
# 1. Azure CLI Extension 및 기본 서비스 공급자(Provider) 등록
# ----------------------------------------------------
az extension add --name containerapp --upgrade --yes
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait

# ----------------------------------------------------
# 2. Azure Container Registry (ACR) 생성 및 관리자 계정 활성화
# ----------------------------------------------------
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# ACR 정보 추출
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "passwords[0].value" -o tsv)

echo "✅ ACR 생성 완료: $ACR_LOGIN_SERVER"

# ----------------------------------------------------
# 3. Azure Container Apps Environment 생성
# ----------------------------------------------------
az containerapp env create \
  --name $CONTAINERAPPS_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

echo "✅ Container Apps Environment 생성 완료"

# ----------------------------------------------------
# 4. API 및 Web Container App 초기 생성 (샘플 이미지)
# ----------------------------------------------------
# API App
az containerapp create \
  --name $API_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENV \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD

# Web App
az containerapp create \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENV \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD

echo "✅ Container Apps (API/Web) 초기화 완료"

# ----------------------------------------------------
# 5. GitHub Actions CI/CD용 Service Principal (인증 정보) 생성
# ----------------------------------------------------
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

echo "----------------------------------------------------"
echo "👇 아래 출력되는 JSON 전체를 GitHub Secret 'AZURE_CREDENTIALS' 에 입력하세요."
echo "----------------------------------------------------"

az ad sp create-for-rbac \
  --name "sp-github-linkcare" \
  --role Contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --json-auth